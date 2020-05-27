import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin/lib/';
import express from 'express';
import {initializeApp} from "firebase-admin";
import * as password from 'password-hash';
import bodyParser from "body-parser";

initializeApp();
const app = express();
const main = express();

main.use('/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({extended: true}));

const db = admin.firestore();

export const webApi = functions.https.onRequest(main);

app.post('/login', async (request, response) => {
    try {
        const snapshot = await db.collection("users")
            .where("username", "==", request.body["username"])
            .get();
        
        const users: any[] = [];
                 
        snapshot.forEach(user => {
            if (password.verify(request.body["password"], `sha1$${user.get("salt")}$2$${user.get("password")}`))
                users.push({token: user.ref.id, email: user.get("email"), displayName: user.get("display")});
        });

        if (users.length > 0) 
            response.set('Access-Control-Allow-Origin', '*').status(200).json(users[0]);
        else
            response.set('Access-Control-Allow-Origin', '*').status(200).json({error: "invalid login credentials"});
    } catch (error) {
        response.status(500).send(error);
    }
});

app.post('/register', async (request, response) => {
    const snapshot = await db.collection("users")
        .where("username", "==", request.body["username"])
        .get();
    if (snapshot.docs.length > 0) {
        response.status(200).json({error: "username is already in use"})
        return;
    }
    
    const hashedPassword = password.generate(request.body["password"], {iterations: 2}).split('$');

    const user = await db.collection("users").add({
        username: request.body["username"],
        email: request.body["email"],
        password: hashedPassword[3],
        salt: hashedPassword[1],
        display: request.body["display"],
    });
    
    response.status(200).json({token: user.id});
});