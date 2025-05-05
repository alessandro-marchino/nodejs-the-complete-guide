const Product = require('../model/product');

exports.getProducts = (_, res) => {
    Product.fetchAll(products => res.render('shop/product-list', { prods: products, pageTitle: 'All products', path: '/products' }));
};

exports.getProductDetail = (req, res) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product => res.render('shop/product-detail', { product, pageTitle: product.title, path: '/products' }));
};

exports.getIndex = (_, res) => {
    Product.fetchAll(products => res.render('shop/index', { prods: products, pageTitle: 'Shop', path: '/' }));
}

exports.getCart = (_, res) => {
    res.render('shop/cart', { pageTitle: 'Your cart', path: '/cart' });
}

exports.postCart = (req, res) => {
    const prodId = req.body.productId;
    console.log(prodId)
    res.redirect('/cart');
}

exports.getOrders = (_, res) => {
    res.render('shop/orders', { pageTitle: 'Your orders', path: '/orders' });
}

exports.getCheckout = (_, res) => {
    res.render('shop/checkout', { pageTitle: 'Checkout', path: '/checkout' });
}
