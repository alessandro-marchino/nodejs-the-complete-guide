const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');

const { routes: adminRoutes } = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const path = require('path');

const app = express();

app.engine('hbs', expressHbs.engine());
app.set('view engine', 'hbs');
app.set('views', 'views/handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((_, res) => res.status(404).render('404', { pageTitle: 'Page Not Found' }));

app.listen(3000);
