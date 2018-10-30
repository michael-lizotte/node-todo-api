const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const todos = [{
    text: 'First test todo',
    _id: new ObjectID()
}, {
    text: 'Second test todo',
    _id: new ObjectID(),
    completed: true,
    completedAt: 333
}, {
    text: 'Third test todo',
    _id: new ObjectID()
}];

const user4ID = new ObjectID();
const user5ID = new ObjectID();

const users = [{
    email: "test@test.com",
    password: "banane",
    _id: new ObjectID()
}, {
    // email: "test2@test.com",
    password: "banane2",
    _id: new ObjectID()
}, {
    email: "test3@test.com",
    // password: "banane3,"
    _id: new ObjectID()
}, {
    email: "michael.lizotte@email.com",
    password: "bananaOne",
    _id: user4ID,
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: user4ID, access: 'auth'}, 'abc123').toString()
    }]
}, {
    email: "gen@example.com",
    password: "user5Pass",
    _id: user5ID
}]
const generateData = (done) => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => {
        User.deleteMany({}).then(() => {
            var userOne = new User(users[3]).save();
            var userTwo = new User(users[4]).save();

            Promise.all([userOne, userTwo]).then(() => {
                done();
            });
        });
    }).catch((err) => {
        console.log(err);
    });    
};

module.exports = {
    generateData, todos, users
}