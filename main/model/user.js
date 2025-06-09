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
        const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.equals(product._id));
        const updatedCartItems = [ ...this.cart.items ];

        let newQuantity = 1;
        if(cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({ productId: product._id, quantity: newQuantity });
        }
        const updatedCart = { items: updatedCartItems };
        return getDb()
            .collection('users')
            .updateOne({ _id: this._id }, { $set: { cart: updatedCart }});
    }
    static findById(userId) {
        return getDb()
            .collection('users')
            .findOne({ _id: ObjectId.createFromHexString(userId) });
    }
}
module.exports = User;
