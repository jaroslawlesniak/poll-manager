const express = require('express');
const mysql = require('mysql');
var bodyParser = require('body-parser');

const app = express();
const config = require('./db_connection.json');

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.get('/polls', (request, response) => {
    connection.query("SELECT ID, Title FROM polls", (err, rows, fields) => {
        response.send({ "polls": rows });
    });
});

app.put('/poll', (request, response) => {
    connection.query(`INSERT INTO polls VALUES (null, '${request.body.title}')`, (err, result) => {
        response.send({ "id": result.insertId, "title": request.body.title });
    });
});

app.post('/poll/:id', (request, response) => {
    connection.query(`UPDATE polls SET Title = '${request.body.title}' WHERE ID = ${parseInt(request.params.id)}`, (err, result) => {
        if (result.affectedRows === 1) {
            response.send({ "updated": true, "id": parseInt(request.params.id), 'title': request.body.title });
        } else {
            response.send({ "updated": false });
        }
    })
});

app.delete('/poll/:id', (request, response) => {
    connection.query(`DELETE FROM polls WHERE ID = ${parseInt(request.params.id)}`, (err, result) => {
        if (result.affectedRows === 1) {
            response.send({ "updated": true });
        } else {
            response.send({ "updated": false });
        }
    })
});

app.listen(8080, () => {
    console.log("Server started!");
});