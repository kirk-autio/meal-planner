import * as admin from "firebase-admin";
import * as hash from "password-hash";
import DocumentData = admin.firestore.DocumentData;
import QueryDocumentSnapshot = admin.firestore.QueryDocumentSnapshot;

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

export class userRepository {
    db = admin.firestore();
    
    async exists(username: string, type: TokenType) : Promise<boolean> {
        const snapshot = await this.db.collection("logins")
            .where("username", "==", username)
            .where("tokenType", "==", type)
            .get();
        
        return snapshot.docs.length > 0;
    }
    
    async socialLogin(username: string, token: string, type: TokenType) : Promise<User | UserError> {
        const error = {error: "Could not login"};
        if (token === "") return error;
        
        const snapshot = await this.db.collection("logins")
            .where("username", "==", username)
            .where("tokenType", "==", type)
            .limit(1)
            .get();
        
        if (snapshot.docs.length === 0) return error;

        const doc: QueryDocumentSnapshot<DocumentData> = snapshot.docs[0];
        const user = await this.db.doc(doc.get("user")).get();
        
        return {token: user.id, email: doc.get("email"), display: doc.get("display"), tokenType: type};
    }
    
    async login(username: string, password: string): Promise<User | UserError> {
        const error = {error: "Invalid login credentials"};
        if (password === "") return error;
        
        const snapshot = await this.db.collection("logins")
            .where("username", "==", username)
            .where("tokenType", "==", TokenType.Standard)
            .limit(1)
            .get();
        
        if (snapshot.docs.length === 0) return error;
        
        const doc: QueryDocumentSnapshot<DocumentData> = snapshot.docs[0];
        if (!hash.verify(password, `sha1$${doc.get("salt")}$2$${doc.get("password")}`)) return error;

        const user = await this.db.doc(doc.get("user")).get();
        return {token: user.id, email: doc.get("email"), display: doc.get("display"), tokenType: TokenType.Standard};
    }
    
    async getUser(email: string): Promise<User | null> {
        const snapshot = await this.db.collection("users")
            .where("email", "==", email)
            .limit(1)
            .get();
        
        if (snapshot.docs.length === 0) return null;
        
        const user = snapshot.docs[0];
        return {email: email, display: user.get("display"), token: user.id, tokenType: TokenType.Standard};
    }
    
    async register(user: User, username: string, password: string = ""): Promise<User | UserError> {
        if (await this.exists(username, user.tokenType)) return {error: "Username is already in use"};

        const existingUser = await this.getUser(user.email);
        const userId: string = existingUser?.token ?? (await this.db.collection("users").add({email: user.email, display: user.display})).id;

        const logins = this.db.collection("logins");
        if (password !== "") {
            const hashedPassword = hash.generate(password, {iterations: 2}).split('$');
            await logins.add({username: username, password: hashedPassword[3], salt: hashedPassword[1], user: userId, tokenType: user.tokenType});
        } else {
            await logins.add({username: username, user: userId, tokenId: `/users/${user.token}`, tokenType: user.tokenType});
        }
        
        user.token = userId;
        return user;
    }
}