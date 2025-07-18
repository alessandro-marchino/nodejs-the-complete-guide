import User from '../model/user.js';
import { hash, compare } from 'bcryptjs';
import { sendMail } from '../util/mail.js';
import { randomBytes } from 'crypto';
import { validationResult } from 'express-validator';
import { defaultHandleError } from '../util/error.js';

/**
 * @param {import('express').Response} res
 */
export function getLogin(_, res) {
  return res.render('auth/login', { pageTitle: 'Login', path: '/login' });
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function postLogin(req, res, next) {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).render('auth/login', { pageTitle: 'Login', path: '/login', errorMessage: errors.array()[0].msg, validationErrors: errors.mapped() });
  }
  let user;
  User.findOne({ email })
    .then(dbUser => user = dbUser)
    .then(() => compare(password, user.password))
    .then(doMatch => {
      if(!doMatch) {
        return res.status(422).render('auth/login', { pageTitle: 'Login', path: '/login', errorMessage: 'Invalid email or password' });
      }
      req.session.user = user;
      req.session.save(err => {
        if(err) {
          return console.error(err);
        }
        res.redirect('/');
      });
    })
    .catch(e => defaultHandleError(e, next));
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function postLogout(req, res) {
  req.session.destroy(() => res.redirect('/'));
}

/**
 * @param {import('express').Response} res
 */
export function getSignup(_, res) {
  return res.render('auth/signup', { pageTitle: 'Signup', path: '/signup' });
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function postSignup (req, res, next) {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422)
      .render('auth/signup', { pageTitle: 'Signup', path: '/signup', errorMessage: errors.array()[0].msg, validationErrors: errors.mapped() });
  }
  return hash(password, 12)
    .then(hashedPassword => {
      const user = new User({ email, password: hashedPassword, cart: { items: [] } });
      return user.save()
    })
    .then(() => {
      res.redirect('/login')
      return sendMail({
        to: { address: email },
        from: { address: 'shop@node-complete.com', name: 'Node-Complete Shop' },
        subject: 'Signup succeeded!',
        html: '<h1>You have successfully signed up!</h1>'
      })
    })
    .catch(e => defaultHandleError(e, next));
}

/**
 * @param {import('express').Response} res
 */
export function getReset(_, res) {
  return res.render('auth/reset', { pageTitle: 'Reset Password', path: '/reset' });
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function postReset(req, res, next) {
  randomBytes(32, (err, buffer) => {
    if(err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if(!user) {
          req.flash('error', 'No account with that email found');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(() => {
        res.redirect('/');
        return sendMail({
          to: { address: req.body.email },
          from: { address: 'shop@node-complete.com', name: 'Node-Complete Shop' },
          subject: 'Password reset!',
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `
        })
      })
      .catch(e => defaultHandleError(e, next));
    });
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function getNewPassword(req, res, next) {
  User.findOne({ resetToken: req.params.token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      if(!user) {
        return res.redirect('/');
      }
      return res.render('auth/new-password', { pageTitle: 'New Password', path: '/new-password', userId: user._id.toString(), token: req.params.token });
    })
    .catch(e => defaultHandleError(e, next));
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function postNewPassword(req, res) {
  const { userId, password, token } = req.body;
  User.findOne({ _id: userId, resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      if(!user) {
        return res.redirect('/');
      }
      return hash(password, 12)
        .then(hashedPassword => {
          user.password = hashedPassword;
          user.resetToken = undefined;
          user.resetTokenExpiration = undefined;
          return user.save()
        })
        .then(() => res.redirect('/login'));
    })
    .catch(e => defaultHandleError(e, next));
}
