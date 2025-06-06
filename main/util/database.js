const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = cb => {
    MongoClient.connect('mongodb://nodejscomplete:mypass@localhost:27017/?authSource=nodejscomplete')
        .then(client => {
            console.log('connected')
            cb(client);
        })
        .catch(err => console.log(err));
}

module.exports = mongoConnect;
