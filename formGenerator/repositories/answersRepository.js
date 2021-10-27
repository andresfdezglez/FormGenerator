module.exports = {

    insertAnswer : async (db, question) => {

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
    }
}
