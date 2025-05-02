const products = [];

exports.getAddProduct = (_, res) => {
    res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product' });
};

exports.postAddProduct = (req, res) => {
    products.push({ title: req.body.title });
    res.redirect('/');
};

exports.getProducts = (_, res) => {
    res.render('shop', { prods: products, pageTitle: 'Shop', path: '/' });
};
