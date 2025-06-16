import express from 'express';
import bodyParser from 'body-parser';
import { connect } from 'mongoose';
import { join } from 'path';
import Session from 'express-session';
import MongoDbStore from 'connect-mongodb-session';

import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';
import authRoutes from './routes/auth.js';
import * as errorController from './controllers/error.js';

import User from './model/user.js';

const MONGODB_URI = 'mongodb://nodejscomplete:mypass@localhost:27017/nodejscomplete?authSource=nodejscomplete';

const app = express();
const store = new (MongoDbStore(Session))({
    uri: MONGODB_URI,
    collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(join(import.meta.dirname, 'public')));
app.use(Session({ secret: 'my secret', resave: false, saveUninitialized: false, store }));
app.use((req, res, next) => {
    res.locals.isAuthenticated = !!req.session?.user;
    if(req.session?.user) {
        return req.user = User.findOne(req.session.user._id)
            .then(user => {
                req.user = user;
                next();
            });
    }
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

connect(MONGODB_URI)
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
