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
import multer from 'multer';
import { randomUUID } from 'crypto';

const MONGODB_URI = 'mongodb://nodejscomplete:mypass@localhost:27017/nodejscomplete?authSource=nodejscomplete';

const app = express();
const store = new (MongoDbStore(Session))({
    uri: MONGODB_URI,
    collection: 'sessions'
});
const { csrfSynchronisedProtection } = csrfSync({
    getTokenFromRequest: req => req.body?._csrf || req.headers?.['csrf-token']
});
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'images'),
  filename: (req, file, cb) => cb(null, `${randomUUID()}-${file.originalname}`)
});
const fileFilter = (req, file, cb) => cb(null, file.mimetype === 'image/png'
  || file.mimetype === 'image/jpg'
  || file.mimetype === 'image/jpeg');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: 'images', storage: fileStorage, fileFilter }).single('image'));
app.use(express.static(join(import.meta.dirname, 'public')));
app.use('/images', express.static(join(import.meta.dirname, 'images')));
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
        if(!user) {
          return next();
        }
        req.user = user;
        next();
      })
      .catch(err => next(new Error(err)));
  }
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);
app.use(errorController.get404);
app.use((err, req, res, next) => {
  res.locals.isAuthenticated = false;
  errorController.get500(req, res)
})

connect(MONGODB_URI)
  .then(() => app.listen(3000))
  .then(() => console.log('App listening on port 3000'))
  .catch(err => console.error(err));
