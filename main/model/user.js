const { ObjectId } = require('mongodb');
const { getDb } = require('../util/database');

class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart;
        this._id = id ? (id instanceof ObjectId ? id : ObjectId.createFromHexString(id)) : null;
    }
    save() {
        const db = getDb();
        if(this._id) {
            return db.collection('users').updateOne({ _id: this._id }, { $set: this });
        }
        return db.collection('users').insertOne(this);
    }
    addToCart(product) {
        console.log(product, this);
        // const cartProduct = this.cart.items.findIndex(cp => cp._id === product._id);
        const updatedCart = { items: [ { productId: product._id, quantity: 1 } ] };
        return getDb()
            .collection('users')
            .updateOne({ _id: this._id }, { $set: { cart: updatedCart }})
            .then(() => console.log('updated'));
    }
    static findById(userId) {
        return getDb()
            .collection('users')
            .findOne({ _id: ObjectId.createFromHexString(userId) });
    }
}
module.exports = User;
