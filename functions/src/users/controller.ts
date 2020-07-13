import * as express from 'express';
import {OAuth2Client} from "google-auth-library";
import {TokenType, User, UserError, userRepository} from "./userRepository";
import * as admin from "firebase-admin";
import * as mailer from "nodemailer";
import {decode, encode} from "jwt-simple";
import {withJWTAuthMiddleware} from "express-kun";

const AUTH_SECRET = "juZgyhvZcF7H52DM3bkA";
const GOOGLE_CLIENT_ID = "814864358844-pm60erbbqtckgfgof0g61f1jh28uftgq.apps.googleusercontent.com";

admin.initializeApp();
export const router = express.Router();
export const authRouter = withJWTAuthMiddleware(router, AUTH_SECRET, req => req.cookies.__session, undefined, (err, req, res) => {res.json({error: req.cookies})});

router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.post("/login", login);
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
    response.status(200).json({success: true});
}

async function forgotPassword(request: any, response: any) {
    const transporter = mailer.createTransport({
        service: "gmail",
        auth: {
            user: "kirk.autio@gmail.com",
            pass: "whmcqalwdsrdlfzw"
        }
    });
    
    const user = await repository.getLogin(request.body.email);
    if (!user) {
        response.status(401).json({error: JSON.stringify(user)});
        return;
    }
    
    const jwt: string = encode({userId: user.token, iat: Math.round(Date.now() / 1000), exp: Math.round(Date.now() / 1000 + (60 * 60 * 24))}, user.password, "HS512");

    const mailOptions = {
        from: "kirk.autio@gmail.com",
        to: request.body.email,
        subject: "Reset your password for Meal Planner",
        text: `https://localhost:5002/forgotPassword/${jwt}`
    };

    transporter.sendMail(mailOptions, (error) => response.status(200).json({status: error !== null ? "failure" : "success"}));
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

async function login(request: any, response: any) {
    const user = await repository.login(request.body.username, request.body.password);
    sendResponse(user, response);
}

async function socialLogin(request: any, response: any) {
    const token: any = request.body.token;
    const accessToken = await verify(token);
    
    if (!accessToken) {
        response.status(500).json({error: "Invalid token"})
        return;
    }

    const user: User | UserError = await repository.register({token: accessToken, email: token.email, display: token.display, tokenType: token.tokenType}, token.email);
    sendResponse("error" in user ? await repository.socialLogin(token.email, accessToken, token.tokenType) : user, response);
}

export async function verify(token: TokenRequest): Promise<string | undefined> {
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
    
    sendResponse(await repository.register({token: "", email: request.body.email, display: request.body.display, tokenType: TokenType.Standard}, request.body.username, request.body.password), response);
}

function sendResponse(user: User | UserError, response: any): void {
    if ("error" in user)
        response.status(401).json(user);
    else {
        response.cookie("__session", encode(user, AUTH_SECRET), {httpOnly: true, secure: true, expires: new Date(Date.now() + 90000)});
        response.status(200).json(user);
    }
}
