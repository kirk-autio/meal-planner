import * as express from 'express';
import * as cors from 'cors';
import {json, urlencoded} from 'body-parser';
import {router} from "./controller";
import * as cookieParser from "cookie-parser";

export const app = express();

app.use(cors({credentials: true, origin: true}))
    .use(cookieParser())
    .use(json())
    .use(urlencoded({extended: true}))
    .use("/v1/users", router)
    .get("*", (_: any, res: any) => res.status(404).json({success: false, data: "Endpoint not found"}));
