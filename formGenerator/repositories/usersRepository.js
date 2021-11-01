module.exports = {

    insertUser : async (db, user) => {

        promise = new Promise((resolve, reject) => {
            var collection = db.collection('users');
            collection.insert(user, (err, result) => {
                if (err) {
                    resolve(null);
                } else {
                    // _id no es un string es un ObjectID
                    resolve(result.ops[0]._id.toString());
                }
                db.close();
            });
        });

        return promise;
},

    obtenerUsuarios : async (db, criterio) => {
        promise = new Promise((resolve, reject) => {
            var collection = db.collection('users');
            collection.find(criterio).toArray( (err, result) => {
                if (err) {
                    resolve(null);
                } else {

                    resolve(result);
                }
                db.close();
            });
        });

        return promise;

    }

}