var env = process.env.NODE_ENV;
var mongoDbUrl = '';

console.log(env);

if(env === 'development') {
    mongoDbUrl = 'mongodb://admin:banane123@ds047592.mlab.com:47592/node-todo-api'
} else if (env === 'test') {
    mongoDbUrl = 'mongodb://test:test123@ds145573.mlab.com:45573/node-todo-api-test'
}

module.exports = {
    mongoDbUrl
}