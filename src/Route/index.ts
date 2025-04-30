import UserRouter from "./UserRoute";

function route(app) {
    app.use('/', UserRouter);

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });
}

export default route;