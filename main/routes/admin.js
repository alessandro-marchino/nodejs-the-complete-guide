const path = require('path');
const rootDir = require('../util/path');
const express = require('express');

const router = express.Router();

router.get('/add-product', (_, res) => {
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});
router.post('/product', (req, res) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;
