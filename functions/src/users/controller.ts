import * as express from 'express';
import {OAuth2Client} from "google-auth-library";
import {TokenType, User, UserError, userRepository} from "./userRepository";
import * as admin from "firebase-admin";

admin.initializeApp();
export const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/socialLogin", socialLogin);

const GOOGLE_CLIENT_ID = "814864358844-pm60erbbqtckgfgof0g61f1jh28uftgq.apps.googleusercontent.com";
const repository = new userRepository();

interface TokenRequest {
    accessToken: string;
    tokenType: TokenType;
    email: string;
    display: string;
}

async function login(request: any, response: any) {
    sendResponse(await repository.login(request.body.username, request.body.password), response);
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
    response.status("error" in user ? 500 : 200).json(user);
}
