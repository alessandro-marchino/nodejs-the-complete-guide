import User from '../model/user.js';

export function getLogin(req, res) {
    return res.render('auth/login', { pageTitle: 'Login', path: '/login' });
}

export function postLogin(req, res) {
    User.findOne({ name: 'Max' })
        .then(user => {
            req.session.user = user;
            res.redirect('/');
        })
}

export function postLogout(req, res) {
    req.session.destroy(() => res.redirect('/'));
}
