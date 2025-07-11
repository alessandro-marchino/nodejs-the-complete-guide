/**
 * @param {import('express').Response} res
 */
export function get404(_, res) {
  return res.status(404)
    .render('404', { pageTitle: 'Page Not Found', path: '/404' });
}

/**
 * @param {import('express').Response} res
 */
export function get500(_, res) {
  return res.status(500)
    .render('500', { pageTitle: 'Error!', path: '/500' });
}
