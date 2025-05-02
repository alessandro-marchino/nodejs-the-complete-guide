const express = require('express');
const bodyParser = require('body-parser');

const { routes: adminRoutes } = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((_, res) => res.status(404).render('404', { pageTitle: 'Page Not Found', path: '' }));

app.listen(3000);
