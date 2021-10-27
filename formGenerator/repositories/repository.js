
module.exports = {
    conexion : async () => {
        var mongo = require("mongodb");
        var db = "mongodb://admin:informatica1234@cluster0-shard-00-00.cw13m.mongodb.net:27017,cluster0-shard-00-01.cw13m.mongodb.net:27017,cluster0-shard-00-02.cw13m.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-u6ak76-shard-0&authSource=admin&retryWrites=true&w=majority";
        promise = new Promise((resolve, reject) => {
            mongo.MongoClient.connect(db, (err, db) => {
                if (err) {
                    resolve(null)
                } else {
                    resolve(db);
                }
            });
        });
        return promise;
    }
}