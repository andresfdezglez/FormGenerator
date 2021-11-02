module.exports = {

    insertForm: async (db, form) => {

        promise = new Promise((resolve, reject) => {
            var collection = db.collection('forms');
            collection.insert(form, (err, result) => {
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

    obtenerFormularios: async (db, criterio) => {
        promise = new Promise((resolve, reject) => {
            var collection = db.collection('forms');
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

    modificarFormulario : async (db, criterio, formulario) => {

        promise = new Promise((resolve, reject) => {
            var collection = db.collection('forms');
            collection.update(criterio, {$set: formulario}, (err, result) => {
                if (err) {
                    resolve(null);
                } else {
                    // modificado
                    resolve(result);
                }
                db.close();
            });
        });

        return promise;
    },




}
