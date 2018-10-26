const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:banane123@ds047592.mlab.com:47592/node-todo-api');

module.exports = {
    mongoose
}