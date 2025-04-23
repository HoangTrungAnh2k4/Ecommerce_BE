const express = require('express');
var cors = require('cors');

const routes = require('./src/routes/index');

const app = express();

const hostname = 'localhost';
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }),
);

app.get('/', (req, res) => {
    res.send('Hello Hoang Trung Anh!');
});

routes(app);

app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
