const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
    if (err)
        return console.log(`Unable to connect: ${err}`);
    console.log("Connected to DB");

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5bd07b6b5bf38094bab40fca')
    // }, {
    //     $set:{completed: true}
    // }, {
    //     returnOriginal: false
    // }).then((res) => {
    //     console.log(res);
    // });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5bd081105bf38094bab40fce')
    }, {
        $set:{
            name: "Michael Lizotte-Gagnon"
        }, $inc:{
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((res) => {
        console.log(res);
    }, (err) => {
        console.log(err);
    });

    db.close();    
})