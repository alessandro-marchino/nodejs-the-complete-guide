const path = require('path');
const rootDir = require('../util/path');
const express = require('express');

const products = [];

const router = express.Router();

router.get('/add-product', (_, res) => {
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});
router.post('/add-product', (req, res) => {
    products.push({ title: req.body.title });
    res.redirect('/');
});

exports.routes = router;
exports.products = products;
