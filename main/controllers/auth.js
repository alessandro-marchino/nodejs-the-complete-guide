import User from '../model/user.js';

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
    // TODO
    return res.redirect('/');
}
