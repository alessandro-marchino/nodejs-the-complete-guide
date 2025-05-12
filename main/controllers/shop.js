const Cart = require('../model/cart');
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
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for(const product of products) {
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
    Product.findById(prodId, product => {
        Cart.addProduct(product.id, product.price, () => res.redirect('/cart'));
    });
}

exports.getOrders = (_, res) => {
    res.render('shop/orders', { pageTitle: 'Your orders', path: '/orders' });
}

exports.getCheckout = (_, res) => {
    res.render('shop/checkout', { pageTitle: 'Checkout', path: '/checkout' });
}
