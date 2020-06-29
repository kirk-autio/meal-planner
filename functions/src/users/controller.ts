import * as express from 'express';
import * as password from "password-hash";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const router = express.Router();

router.post("/login", login);
router.post("/register", register);

function login(request: any, response: any) {
    db.collection("users")
        .where("username", "==", request.body["username"])
        .get()
        .then(snapshot => {
            const users: any[] = [];

            snapshot.forEach(user => {
                if (password.verify(request.body["password"], `sha1$${user.get("salt")}$2$${user.get("password")}`))
                    users.push({token: user.ref.id, email: user.get("email"), displayName: user.get("display")});
            });

            if (users.length > 0)
                response.status(200).json(users[0]);
            else 
                response.status(500).json({error: "invalid login credentials"});
        })
        .catch(error => response.status(500).json({error: error}))
}

function register(request: any, response: any) {
    db.collection("users")
        .where("username", "==", request.body.username)
        .get()
        .then(snapshot => {
            if (snapshot.docs.length > 0)
                response.status(200).json({error: "username is already in use"});
        })
        .catch(error => response.status(500).json({error: error}));

    const hashedPassword = password.generate(request.body["password"], {iterations: 2}).split('$');

     db.collection("users").add({
        username: request.body["username"],
        email: request.body["email"],
        password: hashedPassword[3],
        salt: hashedPassword[1],
        display: request.body["display"],
     })
     .then(snapshot => response.status(200).json({token: snapshot.id}))
     .catch(error => response.status(500).json({error: error}));
}
