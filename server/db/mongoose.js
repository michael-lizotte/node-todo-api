const mongoose = require('mongoose');
const config = require('./../config/config.js');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser : true
});

module.exports = {
    mongoose
}