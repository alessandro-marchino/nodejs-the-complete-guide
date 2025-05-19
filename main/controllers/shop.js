const Cart = require('../model/cart');
const Product = require('../model/product');

exports.getProducts = (_, res) => {
    Product.fetchAll()
        .then(([ rows ]) => {
            res.render('shop/product-list', { prods: rows, pageTitle: 'All products', path: '/products' })
        })
        .catch(e => console.log(e));
};

exports.getProductDetail = (req, res) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(([ products ]) => {
            if(products.length === 0) {
                return res.redirect('/');
            }
            res.render('shop/product-detail', { product: products[0], pageTitle: products[0].title, path: '/products' })
        })
        .catch(e => console.log(e));
};

exports.getIndex = (_, res) => {
    Product.fetchAll()
        .then(([ rows ]) => {
            res.render('shop/index', { prods: rows, pageTitle: 'Shop', path: '/' })
        })
        .catch(e => console.log(e));
}

exports.getCart = (_, res) => {
    Cart.getCart(cart => {
        Product.fetchAll()
        .then(([ rows ]) => {
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
    Product.findById(prodId)
        .then(([ product ]) => {
            Cart.addProduct(product[0].id, product[0].price, () => res.redirect('/cart'));
        })
        .catch(e => console.log(e));
}

exports.postCartDeleteProduct = (req, res) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(([ product ]) => {
            Cart.deleteProduct(prodId, product[0].price, () => res.redirect('/cart'));
        })
        .catch(e => console.log(e));
}

exports.getOrders = (_, res) => {
    res.render('shop/orders', { pageTitle: 'Your orders', path: '/orders' });
}

exports.getCheckout = (_, res) => {
    res.render('shop/checkout', { pageTitle: 'Checkout', path: '/checkout' });
}
