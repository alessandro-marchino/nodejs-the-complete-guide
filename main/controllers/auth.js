export function getLogin(req, res) {
    return res.render('auth/login', { pageTitle: 'Login', path: '/login' });
}

export function postLogin(req, res) {
    req.session.isLoggedIn = true;
    res.redirect('/');
}
