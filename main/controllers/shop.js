const Product = require('../model/product');

exports.getProducts = (_, res) => {
    Product.fetchAll(products => res.render('shop/product-list', { prods: products, pageTitle: 'All products', path: '/products' }));
};

exports.getIndex = (_, res) => {
    Product.fetchAll(products => res.render('shop/index', { prods: products, pageTitle: 'Shop', path: '/' }));
}

exports.getCart = (_, res) => {
    res.render('shop/cart', { pageTitle: 'Your cart', path: '/cart' });
}

exports.getCheckout = (_, res) => {
    res.render('shop/checkout', { pageTitle: 'Checkout', path: '/checkout' });
}
