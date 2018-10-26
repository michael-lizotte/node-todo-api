const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
    if (err)
        return console.log(`Unable to connect: ${err}`);
    console.log("Connected to DB");

    //delete Many
    // db.collection('Todos').deleteMany({text: "Eat lunch"}).then((res) => {
    //     console.log(res);
    // }, (err) => {
    //     console.log(err);
    // });

    //delete One
    // db.collection('Todos').deleteOne({text: "Eat lunch"}).then((res) => {
    //     console.log(res);
    // });

    //find One And Delete
    // db.collection('Todos').findOneAndDelete({text: "Eat lunch"}).then((res) => {
    //     console.log(res);
    // })

    // db.collection('Users').deleteMany({name: "Michael Lizotte-Gagnon"}).then((res) => {
    //     console.log(res);
    // })

    // db.collection('Users').findOneAndDelete({_id: new ObjectID('5bd080f15bf38094bab40fcd')}).then((res) => {
    //     console.log(res);
    // });

    db.close();    
})