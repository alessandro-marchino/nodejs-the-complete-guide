const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
const users = [];

app.get('/', (_, res) => res.render('form'));
app.post('/', (req, res) => {
    users.push({ name: req.body.username });
    res.redirect('/users');
});
app.get('/users', (_, res) => res.render('users', { users: users }));

app.use((_, res) => res.status(404).render('404'));

app.listen(3000);
