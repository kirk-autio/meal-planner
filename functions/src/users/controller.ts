﻿import * as express from 'express';
// import * as password from "password-hash";
import * as admin from "firebase-admin";

admin.initializeApp();
// const db = admin.firestore();

export const router = express.Router();

router.post("/login", login);

function login(request: any, response: any) {
    response.status(200).json({token: '1234', email: 'kirk.autio@gmail.com', display: request.body["username"]});
    return;
    // db.collection("users")
    //     .where("username", "==", request.body["username"])
    //     .get()
    //     .then(snapshot => {
    //         response.status(200).json(snapshot);
    //         // const users: any[] = [];
    //         //
    //         // snapshot.forEach(user => {
    //         //     if (password.verify(request.body["password"], `sha1$${user.get("salt")}$2$${user.get("password")}`))
    //         //         users.push({token: user.ref.id, email: user.get("email"), displayName: user.get("display")});
    //         // });
    //         //
    //         // if (users.length > 0)
    //         //     response.status(200).json(users[0]);
    //         // else 
    //         //     response.status(200).json({error: "invalid login credentials"});
    //     })
    //     .catch(error => response.status(200).json({error: error}))
}
//
// app.post('/login',async (request, response) => {
//     try {
//         const snapshot = await db.collection("users")
//             .where("username", "==", request.body["username"])
//             .get();
//
//         const users: any[] = [];
//
//         snapshot.forEach(user => {
//             if (password.verify(request.body["password"], `sha1$${user.get("salt")}$2$${user.get("password")}`))
//                 users.push({token: user.ref.id, email: user.get("email"), displayName: user.get("display")});
//         });
//
//         if (users.length > 0)
//             response.set({'Access-Control-Allow-Origin': '*'}).status(200).json(users[0]);
//         else
//             response.set({'Access-Control-Allow-Origin': '*'}).status(200).json({error: "invalid login credentials"});
//     } catch (error) {
//         response.status(500).send(error);
//     }
// });
//
// app.post('/register', async (request, response) => {
//     const snapshot = await db.collection("users")
//         .where("username", "==", request.body["username"])
//         .get();
//     if (snapshot.docs.length > 0) {
//         response.status(200).json({error: "username is already in use"})
//         return;
//     }
//
//     const hashedPassword = password.generate(request.body["password"], {iterations: 2}).split('$');
//
//     const user = await db.collection("users").add({
//         username: request.body["username"],
//         email: request.body["email"],
//         password: hashedPassword[3],
//         salt: hashedPassword[1],
//         display: request.body["display"],
//     });
//
//     response.status(200).json({token: user.id});
// });