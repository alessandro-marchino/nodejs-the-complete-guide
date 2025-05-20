const Cart = require('../model/cart');
const Product = require('../model/product');

exports.getProducts = (_, res) => {
    Product.findAll()
        .then(rows => {
            res.render('shop/product-list', { prods: rows, pageTitle: 'All products', path: '/products' })
        })
        .catch(e => console.log(e));
};

exports.getProductDetail = (req, res) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId)
        .then(product => {
            if(!product) {
                return res.redirect('/');
            }
            res.render('shop/product-detail', { product, pageTitle: product.title, path: '/products' })
        })
        .catch(e => console.log(e));
};

exports.getIndex = (_, res) => {
    Product.findAll()
        .then(rows => {
            res.render('shop/index', { prods: rows, pageTitle: 'Shop', path: '/' })
        })
        .catch(e => console.log(e));
}

exports.getCart = (_, res) => {
    Cart.getCart(cart => {
        Product.findAll()
        .then(rows => {
            const cartProducts = [];
            for(const product of rows) {
                const cartProductData = cart?.products.find(prod => prod.id === product.id);
                if(cartProductData) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty });
                }
            }

            res.render('shop/cart', { pageTitle: 'Your cart', path: '/cart', products: cartProducts })
        })
    });
}

exports.postCart = (req, res) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
        .then(product => {
            Cart.addProduct(product.id, product.price, () => res.redirect('/cart'));
        })
        .catch(e => console.log(e));
}

exports.postCartDeleteProduct = (req, res) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
        .then(product => {
            Cart.deleteProduct(prodId, product.price, () => res.redirect('/cart'));
        })
        .catch(e => console.log(e));
}

exports.getOrders = (_, res) => {
    res.render('shop/orders', { pageTitle: 'Your orders', path: '/orders' });
}

exports.getCheckout = (_, res) => {
    res.render('shop/checkout', { pageTitle: 'Checkout', path: '/checkout' });
}
