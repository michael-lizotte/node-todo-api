var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    process.env.MONGODB_URI = 'mongodb://admin:banane123@ds047592.mlab.com:47592/node-todo-api'
} else if (env === 'test') {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/ToDoAppTest'
}