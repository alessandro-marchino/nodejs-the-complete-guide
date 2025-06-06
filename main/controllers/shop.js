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
        .then(cart => cart.getProducts())
        .then(products => res.render('shop/cart', { pageTitle: 'Your cart', path: '/cart', products }))
        .catch(e => console.error(e));
}

exports.postCart = (req, res) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: prodId }})
        })
        .then(products => {
            let product;
            if(products.length > 0) {
                product = products[0]
            }
            if(product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(prodId)
        })
        .then(product => fetchedCart.addProduct(product, { through: { quantity: newQuantity } }))
        .then(() => res.redirect('/cart'))
        .catch(e => console.error(e));
}

exports.postCartDeleteProduct = (req, res) => {
    const prodId = req.body.productId;
    req.user.getCart()
        .then(cart => cart.getProducts({ where: { id: prodId }}))
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(() => res.redirect('/cart'))
        .catch(e => console.error(e));
}

exports.getOrders = (req, res) => {
    req.user.getOrders({ include: [ 'products' ] })
        .then(orders => res.render('shop/orders', { pageTitle: 'Your orders', path: '/orders', orders }))
        .catch(e => console.error(e))
}

exports.postOrder = (req, res) => {
    let products;
    let fetchedCart;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(prods => {
            products = prods;
            return req.user.createOrder()
        })
        .then(order => order.addProducts(products.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity };
            return product;
        })))
        .then(() => fetchedCart.setProducts(null))
        .then(() => res.redirect('/orders'))
        .catch(e => console.log(e));
}

exports.getCheckout = (_, res) => {
    res.render('shop/checkout', { pageTitle: 'Checkout', path: '/checkout' });
}
