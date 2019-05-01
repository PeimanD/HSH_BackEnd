const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://comp4900:somekindofthermostat@hsh-dev-kdiqq.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });

let connectDevDatabase = () => {
    client.connect(async err => {
        if (err) {
            console.log("died");
        }
        try {
            const collection = await client.db("hshDb").collection("user");
            // perform actions on the collection object
            await collection.find({ "fName": "Remilia" }).toArray((err, items) => {

                console.log(items[0].lName);
                //console.log(items[0].lName);
            });
        } catch (e) {
            console.error(e);
        }
        client.close();
    });
}

connectDevDatabase();

module.exports = connectDevDatabase;