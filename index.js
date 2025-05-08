const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');

const { CONNECT_DB } = require('./src/config/db.js');

const routes = require('./src/routes/index.js');

const app = express();

const port = process.env.PORT;

const sever = {
    start: () => {
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
            res.send('Hello World!');
        });

        routes(app);

        app.listen(port, () => {
            console.log(`Server running at http://${port}/`);
        });
    },
};

CONNECT_DB()
    .then(() => {
        console.log('Connected to database successfully');
        sever.start();
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });
