import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import { connect } from 'mongoose';
import { join } from 'path';
import Session from 'express-session';
import MongoDbStore from 'connect-mongodb-session';
// import csrf from 'csurf';
import { csrfSync } from 'csrf-sync';
import flash from 'connect-flash';

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
const { csrfSynchronisedProtection } = csrfSync({
    getTokenFromRequest: req => req.body._csrf
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(join(import.meta.dirname, 'public')));
app.use(Session({ secret: 'my secret', resave: false, saveUninitialized: false, store }));
app.use(csrfSynchronisedProtection, (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
})
app.use(flash());
app.use((req, res, next) => {
    res.locals.errorMessage = req.flash('error')[0];
    next();
})
app.use((req, res, next) => {
    res.locals.oldInput = req.body;
    res.locals.validationErrors = [];;
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
    .then(() => app.listen(3000))
    .then(() => console.log('App listening on port 3000'))
    .catch(err => console.error(err));
