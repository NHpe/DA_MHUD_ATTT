import express from 'express';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';

import route from './Route/index';

const uri = "mongodb+srv://trinhbao:trinhbao1234@cluster0.fbmzyor.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
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

const port = 3000;

route(app);

app.listen(port, () => {
    return console.log(`Listening at port : ${port}`);
});