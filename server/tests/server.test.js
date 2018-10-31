const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, generateData, users} = require('./seed/seed');

before(generateData);

describe('POST /todos', () => {
    it ('Should create a new todo', (done) => {
        var text = 'Test todo';
        
        request(app)
            .post('/todos')
            .set('x-auth', users[3].tokens[0].token)
            .send({
                text
            })
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
            .set('x-auth', users[3].tokens[0].token)
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(4);
                    done();
                }).catch((err) => done(err));
            });
    });
});

describe('GET /todos', () => {
    it('Should get all todos', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', users[3].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(3);
            })
            .end(done);
    });

    it('Should get a specific todo', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[3].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[1].text);
            })
            .end(done);
    });

    it('Should not get an other user\'s todo', (done) => {
        request(app)
            .get(`/todos/${todos[2]._id.toHexString()}`)
            .set('x-auth', users[3].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('Should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[3].tokens[0].token)
            .expect(404)
            .expect((res) => {
                expect(res.body.todo).toBe(undefined);
            })
            .end(done);
    });

    it('Should return 404 if ID is invalid', (done) => {
        request(app)
            .get('/todos/123')
            .set('x-auth', users[3].tokens[0].token)
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
            .delete(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[3].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[1].text);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.findById(todos[1]._id.toHexString()).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }, (err) => {
                    done(err);
                })
            });
    });

    it('Should not delete an other user\'s todo', (done) => {
        request(app)
            .delete(`/todos/${todos[2]._id.toHexString()}`)
            .set('x-auth', users[3].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.findById(todos[2]._id.toHexString()).then((todo) => {
                    expect(todo).toExist();
                    done();
                }, (err) => {
                    done(err);
                })
            });
    })

    it('Should return 404 when ID is invalid', (done) => {
        request(app)
            .delete('/todos/123')
            .set('x-auth', users[3].tokens[0].token)
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
            .set('x-auth', users[3].tokens[0].token)
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
            .set('x-auth', users[3].tokens[0].token)            
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
        var id = todos[0]._id.toHexString();

        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[3].tokens[0].token)
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

    it('Should not update another user\'s todo', (done) => {
        var id = todos[2]._id.toHexString();

        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[3].tokens[0].token)
            .send({
                text: 'test',
                completed: false
            })
            .expect(404)
            .end(done);
    })
});

describe('POST /users', () => {
    it('Should add a user to database', (done) => {
        request(app)
            .post('/users')
            .send(users[0])
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(users[0].email);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                } else {
                    User.findById(res.body._id).then((doc) => {
                        expect(doc).toExist();
                        done();
                    }, (err) => {
                        done(err);
                    });
                }
            });
    });

    it('Should throw a 400 if no password or no email is provided', (done) => {
        request(app)
            .post('/users')
            .send(users[2])
            .expect(400)
            .expect((res) => {
                expect(res.body.code).toBe(11100);
            })
            .end(done);
    });

    it('Should not create user if email in use', (done) => {
        request(app)
            .post('/users')
            .send(users[0])
            .expect(400)
            .expect((res) => {
                expect(res.body.code).toBe(11000);
            })
            .end(done);
    });
});

describe('GET users/me', () => {
    it('Should return a user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[3].tokens[0].token)
            // .send()
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[3]._id.toHexString());
                expect(res.body.email).toBe(users[3].email);
            })
            .end(done);
    });

    it('Should return a 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('Should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[4].email,
                password: users[4].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[4]._id).then((user) => {
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((err) => done(err));
            });
    });

    it('Should reject invalid credentials', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[0].email,
                password: 'banane1'
            })
            .expect(400)
            .expect((res) => {
                expect(res.body.code).toBe(11100);
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findOne({'email':users[0].email}).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((err) => done(err));
            });
    });
})

describe('DELETE /users/me/token', () => {
    it('Should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[3].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[3]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((err) => done(err));
            });
    });
})
