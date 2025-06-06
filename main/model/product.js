const mongodb = require('mongodb');
const { getDb } = require('../util/database');

class Product {
    constructor(title, price, description, imageUrl, id) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        if(id) {
            this._id = mongodb.ObjectId.createFromHexString(id);
        }
    }

    save() {
        const db = getDb();
        if(this._id) {
            return db.collection('products').updateOne({ _id: this._id }, { $set: this });
        }
        return db.collection('products').insertOne(this);
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
            .find({ _id: mongodb.ObjectId.createFromHexString(productId) })
            .next();
    }
}

module.exports = Product;
