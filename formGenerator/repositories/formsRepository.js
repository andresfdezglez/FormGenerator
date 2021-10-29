module.exports = {

    insertForm : async (db, form) => {

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
    }
}
