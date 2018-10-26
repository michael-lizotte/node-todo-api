const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
    if (err) 
        return console.log(`Unable to connect to DB: ${err}`);
    
    console.log("Connected to DB");

    // db.collection('Todos').find({_id: new ObjectID('5bd07b6b5bf38094bab40fca')}).toArray().then((docs) => {
    //     console.log(docs);
    // }, (err) => {
    //     console.log(`Unable to fetch data: ${err}`);
    // });

    db.collection('Users').find({name : "Michael Lizotte-Gagnon"}).count().then((res) => {
        console.log(res);
    }, (err) => {
        console.log(`Unable to execute querry: ${err}`);
    })

    db.close();
})