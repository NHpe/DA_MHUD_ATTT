import express from 'express';
import db from './connect';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('Connected to the database.');
});

app.listen(port, () => {
    return console.log(`Listening at port : ${port}`);
});