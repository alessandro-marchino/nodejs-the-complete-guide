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
    async getCart() {
        const db = getDb();
        const collection = db.collection('products');
        const cursor = collection.find({ _id: { $in: this.cart.items.map(item => item.productId) } });
        const products = await cursor.toArray();
        return products.map(p => ({
            ...p,
            quantity: this.cart.items.find(item => item.productId.equals(p._id)).quantity
        }));
    }
    deleteItemFromCart(productId) {
        const pid = ObjectId.createFromHexString(productId);
        const updatedCartItems = this.cart.items.filter(item => !item.productId.equals(pid));
        return getDb()
            .collection('users')
            .updateOne({ _id: this._id }, { $set: { cart: { items: updatedCartItems } }});
    }
    async addOrder() {
        const products = await this.getCart();
        const order = {
            items: products,
            user: {
                _id: this._id,
                name: this.name
            }
        };
        const db = getDb();
        await db.collection('orders').insertOne(order);
        this.cart = { items: [] };
        return db
            .collection('users')
            .updateOne({ _id: this._id }, { $set: { cart: this.cart }});
    }
    getOrders() {
        return getDb()
            .collection('orders')
            .find({ 'user._id': this._id })
            .toArray();
    }
    static findById(userId) {
        return getDb()
            .collection('users')
            .findOne({ _id: ObjectId.createFromHexString(userId) });
    }
}
module.exports = User;
