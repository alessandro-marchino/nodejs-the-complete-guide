import express from 'express';
import bodyParser from 'body-parser';
import { connect } from 'mongoose';
import { join } from 'path';

import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';
import * as errorController from './controllers/error.js';

// // const User = require('./model/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(join(import.meta.dirname, 'public')));
app.use((req, res, next) => {
    // User.findById('684682f4358f90c920641fd5')
    //     .then(user => {
    //         req.user = new User(user.name, user.email, user.cart, user._id);
    //         next();
    //     })
    //     .catch(e => console.error(e));
    next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

connect('mongodb://nodejscomplete:mypass@localhost:27017/nodejscomplete?authSource=nodejscomplete')
    .then(() => app.listen(3000))
    .catch(err => console.error(err));
