export function get404(req, res) {
  return res.status(404)
    .render('404', { pageTitle: 'Page Not Found', path: '/404' });
}

export function get500(req, res) {
  return res.status(500)
    .render('500', { pageTitle: 'Error!', path: '/500' });
}
