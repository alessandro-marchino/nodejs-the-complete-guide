const express = require('express');
const { products } = require('./admin');

const router = express.Router();

router.get('/', (_, res) => {
    res.render('shop', { prods: products, hasProducts: products.length > 0, activeShop: true, productsCSS: true, pageTitle: 'Shop', path: '/' });
});

module.exports = router;
