const path = require('path');
const rootDir = require('../util/path');
const express = require('express');
const { products } = require('./admin');

const router = express.Router();

router.get('/', (_, res) => {
    console.log(products);
    res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;
