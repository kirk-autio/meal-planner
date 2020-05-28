import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {app} from "./users";
import * as functions from "firebase-functions";

const main = express();

main.use(cors({ origin: true }));
main.use('/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({extended: true}));

export const userApi = functions.https.onRequest(main);
