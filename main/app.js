import express from 'express';
import bodyParser from 'body-parser';
import { connect } from 'mongoose';
import { join } from 'path';
import Session from 'express-session';

import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';
import authRoutes from './routes/auth.js';
import * as errorController from './controllers/error.js';

import User from './model/user.js';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(join(import.meta.dirname, 'public')));
app.use(Session({ secret: 'my secret', resave: false, saveUninitialized: false }));
app.use((req, res, next) => {
    const cookies = (req.get('Cookie') ?? '')
        .split(/\s*;\s*/)
        .reduce((acc, cookie) => {
            acc[cookie.split('=')[0]] = cookie.split('=').slice(1).join('=');
            return acc;
        }, {});
    res.locals.isAuthenticated = cookies['loggedIn'] === 'true';
    next();
})
app.use((req, res, next) => {
    User.findOne({ name: 'Max' })
        .then(user => {
            req.user = user;
            next();
        })
        .catch(e => console.error(e));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

connect('mongodb://nodejscomplete:mypass@localhost:27017/nodejscomplete?authSource=nodejscomplete')
    .then(() => User.findOne({ name: 'Max' }))
    .then(user => {
        if(user) {
            return user;
        }
        return new User({ name: 'Max', email: 'max@test.com', cart: {
            items: []
        }})
        .save();
    })
    .then(() => app.listen(3000))
    .catch(err => console.error(err));
