const express = require('express');

const products = [];

const router = express.Router();

router.get('/add-product', (_, res) => {
    res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product' });
});
router.post('/add-product', (req, res) => {
    products.push({ title: req.body.title });
    res.redirect('/');
});

exports.routes = router;
exports.products = products;
