import Product from '../model/product.js';
import Order from '../model/order.js';

export function getProducts(req, res) {
    Product.find()
        .then(rows => {
            res.render('shop/product-list', { prods: rows, pageTitle: 'All products', path: '/products' })
        })
        .catch(e => console.log(e));
}

export function getProductDetail(req, res) {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if(!product) {
                return res.redirect('/');
            }
            res.render('shop/product-detail', { product, pageTitle: product.title, path: '/products' })
        })
        .catch(e => console.log(e));
}

export function getIndex(req, res) {
    Product.find()
        .then(rows => {
            res.render('shop/index', { prods: rows, pageTitle: 'Shop', path: '/' })
        })
        .catch(e => console.log(e));
}

export function getCart(req, res) {
    req.user
        .populate('cart.items.productId')
        .then(user => res.render('shop/cart', { pageTitle: 'Your cart', path: '/cart', products: user.cart.items }))
        .catch(e => console.error(e));
}

export function postCart(req, res) {
    Product.findById(req.body.productId)
        .then(product => req.user.addToCart(product))
        .then(() => res.redirect('/cart'))
        .catch(e => console.error(e));
}

export function postCartDeleteProduct(req, res) {
    const prodId = req.body.productId;
    req.user
        .deleteItemFromCart(prodId)
        .then(() => res.redirect('/cart'))
        .catch(e => console.error(e));
}

export function getOrders(req, res) {
    Order.find({ 'user.userId': req.user._id })
        .then(orders => res.render('shop/orders', { pageTitle: 'Your orders', path: '/orders', orders }))
        .catch(e => console.error(e))
}

export function postOrder(req, res) {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(i => ({
                quantity: i.quantity,
                productData: { ...i.productId._doc }
            }));

            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user
                },
                products
            });
            return order.save();
        })
        .then(() => req.user.clearCart())
        .then(() => res.redirect('/orders'))
        .catch(e => console.log(e));
}

export function getCheckout(req, res) {
    res.render('shop/checkout', { pageTitle: 'Checkout', path: '/checkout' });
}
