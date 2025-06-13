export function getLogin(_, res) {
    return res.render('auth/login', { pageTitle: 'Login', path: '/login' });
}
