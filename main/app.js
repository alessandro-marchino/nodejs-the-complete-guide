const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const path = require('path');

const sequelize = require('./util/database');
const Product = require('./model/product');
const User = require('./model/user');

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(e => console.error(e))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

sequelize
    .sync()
    // .sync({ force: true })
    .then(() => User.findByPk(1))
    .then(user => {
        if(!user) {
            return User.create({ name: 'Max', email: 'test@example.com '});
        }
        return user;
    })
    .then(() => app.listen(3000))
    .catch(error => console.error(error));
