const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const path = require('path');

// const { mongoConnect } = require('./util/database');
// const User = require('./model/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
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

mongoose.connect('mongodb://nodejscomplete:mypass@localhost:27017/?authSource=nodejscomplete')
    .then(() => app.listen(3000))
    .catch(err => console.error(err));
