const express = require('express');

const app = express();

app.use('/users', (_, res) => {
    res.send('<h1>Users page</h1>');
});
app.use('/', (_, res) => {
    res.send('<h1>Root page</h1>');
});

app.use((_, _1, next) => {
    console.log('Middleware 1');
    next();
});
app.use((_, res) => {
    console.log('Middleware 2');
    res.send('<h1>Response</h1>');
});

app.listen(3000);
