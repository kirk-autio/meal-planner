import * as express from 'express';
import {OAuth2Client} from "google-auth-library";
import {TokenType, User, UserError, userRepository} from "./userRepository";
import * as admin from "firebase-admin";
import {decode, encode} from "jwt-simple";
import {withJWTAuthMiddleware} from "express-kun";
import {emailer} from "./emailer";

const AUTH_SECRET = "juZgyhvZcF7H52DM3bkA";
const GOOGLE_CLIENT_ID = "814864358844-pm60erbbqtckgfgof0g61f1jh28uftgq.apps.googleusercontent.com";

admin.initializeApp();
export const router = express.Router();
export const authRouter = withJWTAuthMiddleware(router, AUTH_SECRET, req => req.cookies.__session, undefined, (err, req, res) => {res.status(401).json({error: "Not logged in"})});

router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.post("/verify", verifyLogin);
router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);
router.post("/socialLogin", socialLogin);
authRouter.get("/", authGet);

const repository = new userRepository();

interface TokenRequest {
    accessToken: string;
    tokenType: TokenType;
    email: string;
    display: string;
}

async function authGet(request: any, response: any) {
    sendResponse(decode(request.cookies.__session, AUTH_SECRET, true, "HS512"), response);
}

async function forgotPassword(request: any, response: any) {
    const user = await repository.getLogin(request.body.email);
    if (!user) {
        response.status(401).json({error: JSON.stringify(user)});
        return;
    }
    
    const jwt: string = encode({userId: user.token, ...getJWT()}, user.password, "HS512");

    const sent = await emailer.send(request.body.email, "Reset your password for Meal Planner", `${request.headers.origin}/passwordReset/${jwt}`);
    response.status(200).json({status: sent ? "success" : "failure"});
}

async function resetPassword(request: any, response: any) {
    try {
        const payload = decode(request.body.token, "", true, "HS512");
        const user = await repository.getLoginByToken(payload.userId, TokenType.Standard);
        if (!user) {
            response.status(500).json({error: "Invalid password reset token supplied"});
            return;
        }
        
        decode(request.body.token, user.password, false, "HS512");

        const result = await repository.updateLogin(payload.userId, undefined, request.body.password);
        response.status(200).json(result)
    } catch (error) {
        response.status(401).json({error: "Invalid or expired token"});
    }
}

async function verifyLogin(request: any, response: any) {
    try {
        const payload = decode(request.body.token, AUTH_SECRET, false, "HS512");
        await repository.verify(payload.userId);
        response.status(200).send();
    } catch {
        response.status(401).json({error: "Invalid or expired token"});
    }
}

async function login(request: any, response: any) {
    const result = await repository.login(request.body.username, request.body.password);
    if ("error" in result)
        sendResponse(result, response);
    
    const user = result as User;
    if (!user.verified) {
        await emailer.send(
            user.email, 
            "Verify your account with Meal Planner", 
            `This email address has not been verified and an attempt was made to login.  If this was you please first verify  your account by clicking on the following link: ${request.headers.origin}/verify/${encode({userId: user.token, ...getJWT()}, AUTH_SECRET, "HS512")}`)
        sendResponse({error: "Invalid login credentials"}, response);
    } else
        sendResponse(user, response);
}

async function logout(request: any, response: any) {
    response.clearCookie("__session");
    response.status(200).send();
}

async function socialLogin(request: any, response: any) {
    const token: any = request.body.token;
    const accessToken = await verifyGoogle(token);
    
    if (!accessToken) {
        response.status(500).json({error: "Invalid token"})
        return;
    }

    const user: User | UserError = await repository.register({token: accessToken, email: token.email, display: token.display, verified: true}, token.tokenType, token.email);
    sendResponse("error" in user ? await repository.socialLogin(token.email, accessToken, token.tokenType) : user, response);
}

export async function verifyGoogle(token: TokenRequest): Promise<string | undefined> {
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({idToken: token.accessToken, audience: GOOGLE_CLIENT_ID});
    const payload = ticket.getPayload();

    return payload?.sub;
}

async function register(request: any, response: any) {
    if (await repository.exists(request.body.username, TokenType.Standard)) {
        response.status(500).json({error: "Username is currently in use"});
        return;
    }

    let user = await repository.register({token: "", email: request.body.email, display: request.body.display, verified: false}, TokenType.Standard, request.body.username, request.body.password);
    
    if (!("error" in user)) {
        const jwt: string = encode({userId: user.token, ...getJWT()}, AUTH_SECRET, "HS512");
        await emailer.send(
            user.email, 
            "Verify your account with Meal Planner", 
            `An account on Meal Planner was created for this email address.  If this was you please verify by clicking on this link: ${request.headers.origin}/verify/${jwt}`);
    }
    
    sendResponse(user, response);
}

function sendResponse(user: User | UserError, response: any): void {
    if ("error" in user)
        response.status(401).json(user);
    else {
        response.cookie("__session", encode({...user, ...getJWT()}, AUTH_SECRET), {httpOnly: true, secure: true, expires: new Date(Date.now() + 90000)});
        response.status(200).json(user);
    }
}

function getJWT() : {iat: number, exp: number} {
    return {iat: Date.now()/1000, exp: Date.now()/1000 + (60*60*24)};
}
