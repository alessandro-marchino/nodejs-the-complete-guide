const { ObjectId } = require('mongodb');
const { getDb } = require('../util/database');

class User {
    constructor(username, email, id) {
        this.name = username;
        this.email = email;
        this._id = id ? ObjectId.createFromHexString(id) : null;
    }
    save() {
        const db = getDb();
        if(this._id) {
            return db.collection('users').updateOne({ _id: this._id }, { $set: this });
        }
        return db.collection('users').insertOne(this);
    }
    static findById(userId) {
        return getDb()
            .collection('users')
            .findOne({ _id: ObjectId.createFromHexString(userId) });
    }
}
module.exports = User;
