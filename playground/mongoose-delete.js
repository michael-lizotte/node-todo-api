const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.deleteMany({}).then((res) => {
//     console.log(res);
// }, (err) => {
//     console.log(err);
// });

// Todo.findByIdAndDelete("5bd2183543fb382966698124").then((todo) => {
//     console.log(todo);
// }, (err) => {
//     console.log(err);
// });

// Todo.findOneAndDelete({_id: '5bd2183543fb382966698124'}).then((todo) => {

// }, (err) => {

// })

