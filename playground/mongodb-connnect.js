// const client = require('mongodb').MongoClient;
/*
 * Object destructuration
 * 
 * Pull 'name' property from 'user' object
 */
// var user = {
//     name: 'Michael',
//     age: 27
// }
// var {name} = user;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
    if (err)
        return console.log(`Unable to connect: ${err}`);
    console.log('Connected to MongoDB');

    // db.collection('Todos').insertOne({
    //     text: 'Something todo',
    //     completed: false
    // }, (err, res) => {
    //     if(err)
    //         return console.log(`Unable to insert to DB: ${err}`);

    //     console.log(JSON.stringify(res.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne({
    //     name: 'Michael Lizotte-Gagnon',
    //     age: 23,
    //     location: 'Canada'
    // }, (err, res) => {
    //     if(err)
    //         return console.log(`Unable to insert to DB: ${err}`);
    //     console.log(JSON.stringify(res.ops, undefined, 2));
    // });

    db.close();
});