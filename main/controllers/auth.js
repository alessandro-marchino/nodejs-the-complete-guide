import User from '../model/user.js';
import { genSaltSync, hash, hashSync } from 'bcryptjs';

export function getLogin(req, res) {
    return res.render('auth/login', { pageTitle: 'Login', path: '/login' });
}

export function postLogin(req, res) {
    User.findOne({ name: 'Max' })
        .then(user => {
            req.session.user = user;
            req.session.save((err) => {
                if(err) {
                    return console.error(err);
                }
                res.redirect('/')
            });
        })
}

export function postLogout(req, res) {
    req.session.destroy(() => res.redirect('/'));
}

export function getSignup(req, res) {
  return res.render('auth/signup', { pageTitle: 'Signup', path: '/signup' });
}

export function postSignup (req, res, next) {
    const { email, password, confirmPassword } = req.body;
    User.findOne({ email })
        .then(userDoc => {
            if(userDoc) {
                return res.redirect('/signup');
            }
            return hash(password, 12);
        })
        .then(hashedPassword => {
            const user = new User({ email, password: hashedPassword, cart: { items: [] } });
            return user.save()
        })
        .then(() => res.redirect('/login'))
        .catch(e => console.error(e));
}
