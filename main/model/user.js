const { ObjectId } = require('mongodb');
const { getDb } = require('../util/database');

class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart;
        this._id = id ? ObjectId.createFromHexString(id) : null;
    }
    save() {
        const db = getDb();
        if(this._id) {
            return db.collection('users').updateOne({ _id: this._id }, { $set: this });
        }
        return db.collection('users').insertOne(this);
    }
    addToCart(product) {
        // const cartProduct = this.cart.items.findIndex(cp => cp._id === product._id);
        const updatedCart = { items: [ {...product, quantity: 1 } ] };
        return getDb()
            .collection('user')
            .updateOne({ _id: this._id }, { $set: { cart: updatedCart }});
    }
    static findById(userId) {
        return getDb()
            .collection('users')
            .findOne({ _id: ObjectId.createFromHexString(userId) });
    }
}
module.exports = User;
