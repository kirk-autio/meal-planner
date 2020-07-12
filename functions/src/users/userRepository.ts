import * as admin from "firebase-admin";
import * as hash from "password-hash";
import DocumentData = admin.firestore.DocumentData;
import QueryDocumentSnapshot = admin.firestore.QueryDocumentSnapshot;
import DocumentReference = admin.firestore.DocumentReference;

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
        
        const doc = snapshot.docs[0];
        if (!hash.verify(password, `sha1$${doc.get("salt")}$2$${doc.get("password")}`)) return error;
        
        const user = await doc.get("user").get();
        return {token: user.id, email: doc.get("email"), display: doc.get("display"), tokenType: TokenType.Standard};
    }
    
    async getLogin(email: string): Promise<{token: string, username: string, password: string} | null> {
        const user = await this.getUser(email);
        if (!user) return null;
        
        const snapshot = await this.db.collection("logins")
            .where("tokenType", "==", TokenType.Standard)
            .where("user", "==", user)
            .limit(1)
            .get();
        if (snapshot.docs.length === 0) return null;
        
        const login = snapshot.docs[0];
        return {token: user.id, username: login.get("username"), password: login.get("password")};
    }
    
    async getLoginByToken(userId: string, tokenType: TokenType): Promise<{token: string, username: string, password: string} | null> {
        const user = this.db.collection("users").doc(userId);
        const snapshot = await this.db.collection("logins")
            .where("user", "==", user)
            .where("tokenType", "==", tokenType)
            .limit(1)
            .get();
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
    
    async register(user: User, username: string, password: string = ""): Promise<User | UserError> {
        if (await this.exists(username, user.tokenType)) return {error: "Username is already in use"};

        const existingUser = (await this.getUser(user.email)) ?? (await this.db.collection("users").add({email: user.email, display: user.display}));

        const logins = this.db.collection("logins");
        if (password !== "") {
            const hashedPassword = hash.generate(password, {iterations: 2}).split('$');
            await logins.add({username: username, password: hashedPassword[3], salt: hashedPassword[1], user: existingUser, tokenType: user.tokenType});
        } else {
            await logins.add({username: username, user: existingUser, tokenId: user.token, tokenType: user.tokenType});
        }
        
        user.token = existingUser.id;
        return user;
    }
    
    async updateLogin(token: string, username?: string, password?: string): Promise<{username: string, password: string} | UserError> {
        if (!username && !password) return {error: "No changes specified"};
        
        const snapshot = await this.db.collection("logins")
            .where("user", "==", this.db.collection("users").doc(token))
            .where("tokenType", "==", TokenType.Standard)
            .limit(1)
            .get();
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