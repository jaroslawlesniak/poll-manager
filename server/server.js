const express = require('express');
const app = express();

app.get('/', (request, response) => {
    response.json({
        'status': "Success"
    });
});

app.listen(8080, () => {
    console.log("Listening!");
});