const fs = require('fs');
const path = require('path');
const basePath = require('../util/path');
const products = [];
const p = path.join(basePath, 'data', 'products.json');

module.exports = class Product {
    constructor(t) {
        this.title = t;
    }
    save() {
        fs.readFile(p, (err, fileContent) => {
            let products = [];
            if(!err) {
                console.log(fileContent)
                products = JSON.parse(fileContent);
            }
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                if(err) {
                    console.log(err);
                }
            });
        });
    }
    static fetchAll(cb) {
        fs.readFile(p, (err, fileContent) => {
            if(err) {
                return cb([]);
            }
            return cb(JSON.parse(fileContent));
        });
    }
}
