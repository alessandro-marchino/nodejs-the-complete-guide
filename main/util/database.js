const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let _db;

const mongoConnect = cb => {
    MongoClient.connect('mongodb://nodejscomplete:mypass@localhost:27017/?authSource=nodejscomplete')
        .then(client => {
            console.log('connected');
            _db = client.db('shop');
            cb();
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}
const getDb = () => {
    if(_db) {
        return _db;
    }
    throw new Error('No database found');
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
