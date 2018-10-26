const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

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
}]

beforeEach((done) => {
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => {
        User.deleteMany({}).then(() => {
            done();
        });
    });    
});

describe('POST /todos', () => {
    it ('Should create a new todo', (done) => {
        var text = 'Test todo';
        
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(4);
                    expect(todos[3].text).toBe(text);
                    done();
                }).catch((err) => done(err));
            });
    });

    it ('Should not create a todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    done();
                }).catch((err) => done(err));
            });
    });
});

describe('GET /todos', () => {
    it('Should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(3);
            })
            .end(done);
    });

    it('Should get a specific todo', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[1].text);
            })
            .end(done);
    });

    it('Should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.todo).toBe(undefined);
            })
            .end(done);
    });

    it('Should return 404 if ID is invalid', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .expect((res) => {
                expect(res.body.todo).toBe(undefined);
            })
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('Should delete todo', (done) => {
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.findById(todos[0]._id.toHexString()).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }, (err) => {
                    done(err);
                })
            });
    });

    it('Should return 404 when ID is invalid', (done) => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .expect((res) => {
                expect(res.body.todo).toBe(undefined);
            })
            .end((err, res) => {
                done(err);
            });
    });

    it('Should return 404 when todo is not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID()}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.todo).toBe(undefined);
            })
            .end((err, res) => {
                done(err);
            });
    });
});

describe('PATCH /todos/:id', () => {
    it('Should update the todo', (done) => {
        var id = todos[0]._id.toHexString();

        request(app)
            .patch(`/todos/${id}`)
            .send({
                text: 'test',
                completed: true
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe('test');
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);

    });

    it('Should clear completedAt when todo is not completed', (done) => {
        var id = todos[1]._id.toHexString();

        request(app)
            .patch(`/todos/${id}`)
            .send({
                text: 'test',
                completed: false
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe('test');
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('Should add a user to database', (done) => {
        request(app)
            .post('/users')
            // .send({
            //     email: users[0].email,
            //     password: users[0].password
            // })
            .send(users[0])
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(users[0].email);
                expect(res.body.password).toBe(users[0].password);
            })
            .end((err, res) => {
                if(err) {
                    done(err)
                } else {
                    User.find().then((doc) => {
                        expect(doc.length).toBe(1);
                        expect(doc[0].email).toBe(users[0].email);
                        done();
                    }, (err) => {
                        done(err);
                    })
                }
            });
    });

    it('Should thow a 400 if no password or no email is provided', (done) => {
        request(app)
            .post('/users')
            .send(users[2])
            .expect(400)
            .end(done);
    });
})
