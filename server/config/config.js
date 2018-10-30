var env = process.env.NODE_ENV;
var mongoDbUrl = '';

console.log(env);

if(env === 'test') {
    mongoDbUrl = 'mongodb://127.0.0.1:27017/node-todo-api-test'
} else if(env === 'production') {
    mongoDbUrl = 'mongodb://admin:banane123@ds047592.mlab.com:47592/node-todo-api'    
} else {
    mongoDbUrl = 'mongodb://127.0.0.1:27017/node-todo-api'
}

module.exports = {
    mongoDbUrl
}