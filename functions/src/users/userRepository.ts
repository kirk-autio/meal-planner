import * as admin from "firebase-admin";
import * as hash from "password-hash";
import DocumentData = admin.firestore.DocumentData;

export enum TokenType {
    Standard,
    Google,
    Facebook
}

export interface UserError {
    error: string
}

export interface User {
    token: string,
    email: string,
    display: string
    tokenType: TokenType
}

interface TokenData {
    token: string,
    tokenType: TokenType
}

export class userRepository {
    db = admin.firestore();
    
    async exists(username: string) : Promise<boolean> {
        const snapshot = await this.db.collection("users")
            .where("username", "==", username)
            .get();
        
        return snapshot.docs.length > 0;
    } 
    
    async socialLogin(username: string, token: string, type: TokenType) : Promise<User | UserError> {
        const error = {error: "Could not login"};
        if (token === "") return error;

        const snapshot = await this.db.collection("users")
            .where("username", "==", username)
            .limit(1)
            .get();
        
        if (snapshot.docs.length === 0) return error;

        const doc: DocumentData = snapshot.docs[0];
        const tokens: TokenData[] = doc.get("socialTokens");
                
        return tokens.some(t => t.tokenType === type && t.token === token) 
            ? {token: doc.ref.id, email: doc.get("email"), display: doc.get("display"), tokenType: type} 
            : error;
    }
    
    async login(username: string, password: string): Promise<User | UserError> {
        const error = {error: "Invalid login credentials"};
        if (password === "") return error;
        
        const snapshot = await this.db.collection("users")
            .where("username", "==", username)
            .limit(1)
            .get();
        
        if (snapshot.docs.length === 0) return error;
        
        const user: DocumentData = snapshot.docs[0];
        if (!hash.verify(password, `sha1$${user.get("salt")}$2$${user.get("password")}`)) return error;
        
        return {token: user.ref.id, email: user.get("email"), display: user.get("display"), tokenType: TokenType.Standard};
    }
    
    async register(user: User, username: string, password: string = ""): Promise<User | UserError> {
        if (await this.exists(username)) return {error: "Username is already in use"};
        
        const hashedPassword = password !== "" ? hash.generate(password, {iterations: 2}).split('$') : ["", "", "", ""];
        
        const newUser = {
            username: username,
            email: user.email,
            password: hashedPassword[3],
            salt: hashedPassword[1],
            display: user.display,
            socialTokens: user.tokenType === TokenType.Standard ? [] : [{token: user.token, tokenType: user.tokenType}]
        };

        const snapshot = await this.db.collection("users").add(newUser);
        
        user.token = snapshot.id;
        return user;
    }
}