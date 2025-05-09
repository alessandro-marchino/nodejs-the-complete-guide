const fs = require('fs');
const path = require('path');
const crypto = require("crypto");
const basePath = require('../util/path');
const Cart = require('./cart');
const p = path.join(basePath, 'data', 'products.json');

const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if(err) {
            return cb([]);
        }
        return cb(JSON.parse(fileContent));
    });
}

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }
    save(cb) {
        getProductsFromFile(products => {
            let updatedProducts = products;
            if(this.id) {
                const existingProductId = products.findIndex(prod => prod.id === this.id);
                updatedProducts = [ ...products ];
                updatedProducts[existingProductId] = this;
            } else {
                this.id = crypto.randomUUID();
                products.push(this);
            }
            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                if(err) {
                    console.log(err);
                }
                cb();
            });
        });
    }
    static deleteById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            const updatedProducts = products.filter(p => p.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                if(err) {
                    console.log(err);
                    return;
                }
                // Delete from cart
                Cart.deleteProduct(id, product.price, cb);
            });
        });
    }
    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }
}
