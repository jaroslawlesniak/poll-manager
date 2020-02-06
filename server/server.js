const express = require('express');
const mysql = require('mysql');

const app = express();
const config = require('./db_connection.json');

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

let connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

app.get('/user/:user', (request, response) => {
    connection.query(`SELECT ID FROM users WHERE Name = '${request.params.user}'`, (err, rows, fields) => {
        if (rows.length === 1) {
            response.send({ "id": rows[0].ID });
        } else {
            connection.query(`INSERT INTO users VALUES (null, '${request.params.user}')`, (err, result) => {
                response.send({ "id": result.insertId });
            });
        }
    });
});

app.listen(8080, () => {
    console.log("Server started!");
});