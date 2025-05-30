import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../src/.env') });

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import route from './Route/index';



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

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());

route(app);

app.listen(Number(process.env.PORT), () => {
    return console.log(`Listening at port : ${process.env.PORT}`);
});