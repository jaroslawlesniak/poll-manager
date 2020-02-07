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

app.get('/polls', (request, response) => {
    connection.query("SELECT ID, Title FROM polls", (err, rows, fields) => {
        response.send({ "polls": rows || [] });
    });
});

app.get('/poll/:id', (request, response) => {
    connection.query(`SELECT ID, Title FROM polls WHERE ID = ${request.params.id}`, (err, rows, fields) => {
        response.send({ "title": rows[0].Title || "" });
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

app.get('/questions/:id', (request, response) => {
    connection.query(`SELECT ID, PollID, Title, Type, AdditionalInfo FROM questions WHERE PollID = ${request.params.id}`, (err, rows, fields) => {
        response.send({ "questions": rows || [] });
    });
});

app.put('/question', (request, response) => {
    connection.query(`INSERT INTO questions VALUES (null, ${request.body.pollID}, '${request.body.title}', ${request.body.type}, '${request.body.additionalInfo}')`, (err, result) => {
        response.send({
            id: result.insertId,
            pollID: request.body.pollID,
            title: "",
            additionalInfo: "",
            type: parseInt(request.body.type)
        });
    });
});

app.delete('/question/:id', (request, response) => {
    connection.query(`DELETE FROM questions WHERE ID = ${parseInt(request.params.id)}`, (err, result) => {
        if (result.affectedRows === 1) {
            response.send({ "deleted": true });
        } else {
            response.send({ "deleted": false });
        }
    })
});

app.post('/question/:id', (request, response) => {
    connection.query(`UPDATE questions SET Title = '${request.body.title}', AdditionalInfo = '${request.body.additionalInfo}' WHERE ID = ${parseInt(request.params.id)}`, (err, result) => {
        if (result.affectedRows === 1) {
            response.send({ "updated": true });
        } else {
            response.send({ "updated": false });
        }
    })
});

app.get('/answers/:id', (request, response) => {
    connection.query(`SELECT ID, QuestionID, Title FROM answers WHERE QuestionID = ${request.params.id}`, (err, rows, fields) => {
        response.send({ "answers": rows || [] });
    });
});

app.put('/answer', (request, response) => {
    connection.query(`INSERT INTO answers VALUES (null, ${request.body.questionID}, '')`, (err, result) => {
        response.send({
            id: result.insertId,
            questionID: request.body.questionID,
            title: "",
        });
    });
});

app.delete('/answer/:id', (request, response) => {
    connection.query(`DELETE FROM answers WHERE ID = ${parseInt(request.params.id)}`, (err, result) => {
        if (result.affectedRows === 1) {
            response.send({ "deleted": true });
        } else {
            response.send({ "deleted": false });
        }
    })
});

app.post('/answer/:id', (request, response) => {
    connection.query(`UPDATE answers SET Title = '${request.body.title}' WHERE ID = ${parseInt(request.params.id)}`, (err, result) => {
        if (result.affectedRows === 1) {
            response.send({ "updated": true });
        } else {
            response.send({ "updated": false });
        }
    })
});

app.post('/user_answers', (request, response) => {
    const id = parseInt(request.body.pollID);
    for (let [key, answer] of Object.entries(request.body.answers)) {
        if (typeof answer === "number") {
            connection.query(`INSERT INTO user_answers VALUES (null, ${id}, ${key}, '', false, ${answer})`);
        }
        if (typeof answer === "string") {
            connection.query(`INSERT INTO user_answers VALUES (null, ${id}, ${key}, '${answer}', false, false)`);
        }
        if (typeof answer === "boolean") {
            connection.query(`INSERT INTO user_answers VALUES (null, ${id}, ${key}, '', ${answer}, false)`);
        }
        if (typeof answer === "object") {
            for (let answerID of answer) {
                connection.query(`INSERT INTO user_answers VALUES (null, ${id}, ${key}, '', false, ${answerID})`);
            }
        }
    }
    response.send({"added": true});
});

app.get('/results/:id', (request, response) => {
    let named_answers = {};
    connection.query(`SELECT ID, Title FROM answers`, (err, rows, fields) => {
        for(let answer of rows) {
            named_answers[answer.ID] = answer.Title;
        }
    });
    
    named_answers[-1] = "Nie";
    named_answers[0] = "Tak";

    connection.query(`SELECT QuestionID, Input, Switch, Checkbox FROM user_answers WHERE PollID = ${request.params.id}`, (err, rows, fields) => {
        let temp = {};
        let answers = {};
        for (let [key, answer] of Object.entries(rows)) {
            if (temp[answer.QuestionID]) {
                temp[answer.QuestionID].push({ answer: answer.Input || answer.Switch || answer.Checkbox, amount: 1 });
            } else {
                temp[answer.QuestionID] = [{ answer: answer.Input || answer.Switch || answer.Checkbox, amount: 1 }];
            }
        }
        for (let [key, answer] of Object.entries(temp)) {
            let result = [];
            answer.forEach(function (a) {
                if (!this[a.answer]) {
                    this[a.answer] = { answer: named_answers[a.answer] || a.answer, amount: 0 };
                    result.push(this[a.answer]);
                }
                this[a.answer].amount += a.amount;

            }, Object.create(null));
            answers[key] = result;
        }
        response.send({ "answers": answers || [] });
    });
});

app.listen(8080, () => {
    console.log("Server started!");
});