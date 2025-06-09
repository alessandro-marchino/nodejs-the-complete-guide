const mongodb = require('mongodb');
const { getDb } = require('../util/database');

class Product {
    constructor(title, price, description, imageUrl, userId, id) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.userId = userId;
        this._id = id ? mongodb.ObjectId.createFromHexString(id) : null;
    }

    save() {
        const db = getDb();
        console.log(this)
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
    static deleteById(productId) {
        return getDb()
            .collection('products')
            .deleteOne({ _id: mongodb.ObjectId.createFromHexString(productId) })
    }
}

module.exports = Product;
