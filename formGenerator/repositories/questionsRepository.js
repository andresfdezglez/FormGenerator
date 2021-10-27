module.exports = {

    insertQuestion : async (db, question) => {

        promise = new Promise((resolve, reject) => {
            var collection = db.collection('questions');
            collection.insert(question, (err, result) => {
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
