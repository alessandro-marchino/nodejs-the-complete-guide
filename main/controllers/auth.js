export function getLogin(req, res) {
    return res.render('auth/login', { pageTitle: 'Login', path: '/login' });
}

export function postLogin(req, res) {
    res.setHeader('Set-Cookie', 'loggedIn=true');
    res.redirect('/');
}
