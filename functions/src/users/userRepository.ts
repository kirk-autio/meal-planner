import * as admin from "firebase-admin";
import * as hash from "password-hash";
import DocumentData = admin.firestore.DocumentData;
import QueryDocumentSnapshot = admin.firestore.QueryDocumentSnapshot;
import DocumentReference = admin.firestore.DocumentReference;
import QuerySnapshot = admin.firestore.QuerySnapshot;

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
    display: string,
    verified: boolean
}

export class userRepository {
    db = admin.firestore();
    
    async exists(username: string, type: TokenType) : Promise<boolean> {
        return (await this.getFromUsername(username, type)).docs.length > 0;
    }
    
    async getFromUsername(username: string, type: TokenType) : Promise<QuerySnapshot<DocumentData>> {
        return this.db.collection("logins")
            .where("username", "==", username)
            .where("tokenType", "==", type)
            .limit(1)
            .get();
    }
    
    async getFromUser(user: DocumentReference<DocumentData>, type: TokenType) : Promise<QuerySnapshot<DocumentData>> {
        return this.db.collection("logins")
            .where("user", "==", user)
            .where("tokenType", "==", type)
            .limit(1)
            .get();
    }
    
    async socialLogin(username: string, token: string, type: TokenType) : Promise<User | UserError> {
        const error = {error: "Could not login"};
        if (token === "") return error;
        
        const snapshot = await this.getFromUsername(username, type);
        if (snapshot.docs.length === 0) return error;

        const doc: QueryDocumentSnapshot<DocumentData> = snapshot.docs[0];
        return this.getUserFrom(await doc.get("user").get());
    }
    
    async login(username: string, password: string): Promise<User | UserError> {
        const error = {error: "Invalid login credentials"};
        if (password === "") return error;
        
        const snapshot = await this.getFromUsername(username, TokenType.Standard);
        if (snapshot.docs.length === 0) return error;
        
        const doc = snapshot.docs[0];
        if (!hash.verify(password, `sha1$${doc.get("salt")}$2$${doc.get("password")}`)) return error;
        
        return this.getUserFrom(await doc.get("user").get());
    }
    
    private getUserFrom(doc: any): User {
        return {token: doc.id, email: doc.get("email"), display: doc.get("display"), verified: doc.get("verified")};
    }
    
    async getLogin(email: string): Promise<{token: string, username: string, password: string} | null> {
        const user = await this.getUser(email);
        if (!user) return null;
        
        const snapshot = await this.getFromUser(user, TokenType.Standard);
        if (snapshot.docs.length === 0) return null;
        
        const login = snapshot.docs[0];
        return {token: user.id, username: login.get("username"), password: login.get("password")};
    }
    
    async getLoginByToken(userId: string, tokenType: TokenType): Promise<{token: string, username: string, password: string} | null> {
        const snapshot = await this.getFromUser(this.db.collection("users").doc(userId), tokenType);
        if (snapshot.docs.length === 0) return null;
        
        const login = snapshot.docs[0];
        return {token: userId, username: login.get("username"), password: login.get("password")};
    }
    
    async getUser(email: string): Promise<DocumentReference | null> {
        const snapshot = await this.db.collection("users")
            .where("email", "==", email)
            .limit(1)
            .get();
        
        if (snapshot.docs.length === 0) return null;
        
        return snapshot.docs[0].ref;
    }
    
    async register(user: User, tokenType: TokenType, username: string, password: string = ""): Promise<User | UserError> {
        if (await this.exists(username, tokenType)) return {error: "Username is already in use"};

        const existingUser = (await this.getUser(username)) ?? (await this.db.collection("users").add({email: user.email, display: user.display, verified: password === ""}));

        const logins = this.db.collection("logins");
        if (password !== "") {
            const hashedPassword = hash.generate(password, {iterations: 2}).split('$');
            await logins.add({username: username, password: hashedPassword[3], salt: hashedPassword[1], user: existingUser, tokenType: tokenType});
        } else {
            await logins.add({username: username, user: existingUser, tokenId: user.token, tokenType: tokenType});
        }
        
        user.token = existingUser.id;
        return user;
    }
    
    async verify(userId: string) : Promise<boolean> {
        const userRecord = this.db.collection("users").doc(userId);
        const user = this.getUserFrom(await userRecord.get());
        delete user.token;
        await userRecord.set({...user, verified: true});
        return true;
    }
    
    async updateLogin(token: string, username?: string, password?: string): Promise<{username: string, password: string} | UserError> {
        if (!username && !password) return {error: "No changes specified"};
        
        const snapshot = await this.getFromUser(this.db.collection("users").doc(token), TokenType.Standard);
        if (snapshot.docs.length === 0) return {error: "User does not exist"};

        const login = snapshot.docs[0].data();
        
        if (password) {
            const hashedPassword = hash.generate(password, {iterations: 2}).split('$');
            login.password = hashedPassword[3];
            login.salt = hashedPassword[1];
        }
        
        if (username) {
            login.username = username;
        }

        await this.db.collection("logins").doc(snapshot.docs[0].id).set(login);
        return {username: login.username, password: login.password};
    }
    
    async update(user: User, password: string = ""): Promise<void> {
        await this.db.collection("users").doc(user.token).set(user);
    }
}