const express = require('express');
const { products } = require('./admin');

const router = express.Router();

router.get('/', (_, res) => {
    res.render('shop', { prods: products, pageTitle: 'Shop', path: '/' });
});

module.exports = router;
