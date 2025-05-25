import express from 'express';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import route from './Route/index';

dotenv.config({ path: path.resolve(__dirname, '../src/.env') });

const uri = process.env.DATABASE_URI;
const clientOptions = { serverApi: { version: "1" as const, strict: false, deprecationErrors: true } };

function connect() {
    mongoose.connect(uri, clientOptions)
    .then (() =>{
        console.log("Connect successfully to MongoDB");
    })
    .catch((error) => {
        console.error('Cannot connect to MongoDB : ', error);
    });
}
connect();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

route(app);

app.listen(Number(process.env.PORT), () => {
    return console.log(`Listening at port : ${process.env.PORT}`);
});