const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = (cb) => {
  MongoClient.connect(
    "mongodb+srv://shivraj:shiv@cluster0.bu9ow60.mongodb.net/?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("CONNECTED");
      _db = client.db('shop'); //connect to shop database
      cb();
    })
    .catch((err) => {
      console.log(err);
    });
};

const getDb = ()=>{
    if(_db) return _db;
    throw 'No database found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
