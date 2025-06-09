const Product = require('../model/product');

exports.getProducts = (_, res) => {
    Product.fetchAll()
        .then(rows => {
            res.render('shop/product-list', { prods: rows, pageTitle: 'All products', path: '/products' })
        })
        .catch(e => console.log(e));
};

exports.getProductDetail = (req, res) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if(!product) {
                return res.redirect('/');
            }
            res.render('shop/product-detail', { product, pageTitle: product.title, path: '/products' })
        })
        .catch(e => console.log(e));
};

exports.getIndex = (_, res) => {
    Product.fetchAll()
        .then(rows => {
            res.render('shop/index', { prods: rows, pageTitle: 'Shop', path: '/' })
        })
        .catch(e => console.log(e));
}

exports.getCart = (req, res) => {
    req.user.getCart()
        .then(products => res.render('shop/cart', { pageTitle: 'Your cart', path: '/cart', products }))
        .catch(e => console.error(e));
}

exports.postCart = (req, res) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => req.user.addToCart(product))
        .then(() => res.redirect('/cart'))
        .catch(e => console.error(e));
}

exports.postCartDeleteProduct = (req, res) => {
    const prodId = req.body.productId;
    req.user
        .deleteItemFromCart(prodId)
        .then(() => res.redirect('/cart'))
        .catch(e => console.error(e));
}

exports.getOrders = (req, res) => {
    req.user.getOrders({ include: [ 'products' ] })
        .then(orders => res.render('shop/orders', { pageTitle: 'Your orders', path: '/orders', orders }))
        .catch(e => console.error(e))
}

exports.postOrder = (req, res) => {
    req.user.addOrder()
        .then(() => res.redirect('/orders'))
        .catch(e => console.log(e));
}

exports.getCheckout = (_, res) => {
    res.render('shop/checkout', { pageTitle: 'Checkout', path: '/checkout' });
}
