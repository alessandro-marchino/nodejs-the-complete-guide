const mongodb = require('mongodb');
const { getDb } = require('../util/database');

class Product {
    constructor(title, price, description, imageUrl) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    save() {
        const db = getDb();
        return db.collection('products')
            .insertOne(this)
            .then(result => console.log(result));
    }

    static fetchAll() {
        return getDb()
            .collection('products')
            .find()
            .toArray();
    }
    static findById(productId) {
        return getDb()
            .collection('products')
            .find({ _id: new mongodb.ObjectId(productId) })
            .next();
    }
}

module.exports = Product;
