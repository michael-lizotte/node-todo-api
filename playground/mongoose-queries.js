const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5bd091327da043a80531fe64';

// if (!ObjectID.isValid(id)) {
//     return console.log(`ID: ${id} is not valid`)
// }

// Todo.find({
//     _id: id
// }).then((todo) => {
//     console.log(todo);
// }, (err) => {
//     console.log(err);
// });

// Todo.findById(id).then((todo) => {
//     if(!todo) {
//         return console.log(`ID: ${id} not found`);
//     }
//     console.log(todo);
// }, (err) => {
//     console.log(err);
// }).catch((e) => {
//     console.log(e);
// })

if (!ObjectID.isValid(id)) {
    return console.log(`ID: ${id} is not valid`);
}

User.findById(id).then((user) => {
    if(!user) {
        return console.log(`User with ID: ${id} not found`);
    }
    console.log(user);
}, (err) => {
    console.log(err);
})
