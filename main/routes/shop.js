const express = require('express');

const router = express.Router();

app.use('/', (_, res) => {
    res.send('<h1>Hello from Express!</h1>')
});

module.exports = router;
