const path = require('path');
const express = require('express');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_, res) => res.sendFile(path.join(__dirname, 'views', 'home.html')));
app.get('/users', (_, res) => res.sendFile(path.join(__dirname, 'views', 'users.html')));

app.listen(3000);
