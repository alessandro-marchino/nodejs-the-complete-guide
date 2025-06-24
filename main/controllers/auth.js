import User from '../model/user.js';
import { hash, compare } from 'bcryptjs';
import { sendMail } from '../util/mail.js';

export function getLogin(req, res) {
    return res.render('auth/login', { pageTitle: 'Login', path: '/login' });
}

export function postLogin(req, res) {
    const { email, password } = req.body;
    User.findOne({ email })
        .then(user => {
            if(!user) {
                req.flash('error', 'Invalid email or password');
                return res.redirect('/login');
            }
            return compare(password, user.password)
                .then(doMatch => {
                    if(!doMatch) {
                        req.flash('error', 'Invalid email or password');
                        return res.redirect('/login');
                    }
                    req.session.user = user;
                    req.session.save((err) => {
                        if(err) {
                            return console.error(err);
                        }
                        res.redirect('/');
                    });
                })
        })
        .catch(e => console.error(e));
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
                req.flash('error', 'Email exists already. Please pick a different one.');
                return res.redirect('/signup');
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
                });
        })
        .catch(e => console.error(e));
}

export function getReset(req, res) {
    return res.render('auth/reset', { pageTitle: 'Reset Password', path: '/reset' });
}
