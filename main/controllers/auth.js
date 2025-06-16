export function getLogin(req, res) {
    return res.render('auth/login', { pageTitle: 'Login', path: '/login', isAuthenticated: req.isLoggedIn });
}

export function postLogin(req, res) {
    req.isAuthenticated = true;
    res.redirect('/');
}
