import mongoose from "mongoose";

const uri = "mongodb+srv://trinhbao:trinhbao1234@cluster0.fbmzyor.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri);

const db = mongoose.connection;

export default db;