module.exports = {

    insertAnswer : async (db, answer) => {

        promise = new Promise((resolve, reject) => {
            var collection = db.collection('answers');
            collection.insert(answer, (err, result) => {
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

    obtenerRespuestas: async (db, criterio) => {
        promise = new Promise((resolve, reject) => {
            var collection = db.collection('answers');
            collection.find(criterio).toArray((err, result) => {
                if (err) {
                    resolve(null);
                } else {

                    resolve(result);
                }
                db.close();
            });


        })
        return promise;
    },

}
