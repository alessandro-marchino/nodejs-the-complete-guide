const fs = require('fs');
const path = require('path')
const basePath = require('../util/path');
const p = path.join(basePath, 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id, productPrice, cb) {
        // Fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if(!err) {
                cart = JSON.parse(fileContent);
            }
            // Analyze the cart => find existing products
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            // Add new product / Increase quantity
            let updatedProduct;
            if(existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [ ...cart.products ];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id, qty: 1 };
                cart.products = [ ...cart.products, updatedProduct ];
            }
            cart.totalPrice += +productPrice;
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.error(err);
                cb();
            });
        })
    }
    static deleteProduct(id, price, cb) {
        fs.readFile(p, (err, fileContent) => {
            if(err) {
                return cb();
            }
            const cart = JSON.parse(fileContent);
            const updatedCart = { ...cart };
            const product = updatedCart.products.find(prod => prod.id === id);
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            updatedCart.totalPrice -= price * product.qty;
            fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
                console.error(err);
                cb();
            });
        })
    }
    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            if(err) {
                return cb(null);
            }
            const cart = JSON.parse(fileContent);
            cb(cart);
        })
    }
}
