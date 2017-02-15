const supertest = require("supertest");
const expect = require("expect");

const {app} = require("./../server");
const {Todo} = require("./../models/todo");
const {User} = require("./../models/user");
const {ObjectID} = require("mongodb");
const {todos, populateTodos, users, populateUsers} = require("./seed/seed");

beforeEach(populateUsers);
beforeEach(populateTodos);

describe("Todos", () => {
    describe("POST /todos", () => {
        it("should create a new todo", (done) => {
            var text = "Test todo text";

            supertest(app)
            .post("/todos")
            .set("x-auth", users[0].tokens[0].token)
            .send({text})
            .expect(200)
            .expect((response) => {
                expect(response.body.text).toBe(text);
            })
            .end((error, response) => {
                if(error) return done(error);
            
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((error) => done(error));
            });
        });

        it("should not create a new todo with invalid data", (done) => {
            supertest(app)
            .post("/todos")
            .set("x-auth", users[0].tokens[0].token)
            .send({})
            .expect(400)
            .end((error, response) => {
                if(error) return done(error);
                
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((error) => done(error));
            });
        });
    });

    describe("GET /todos", () => {
        it("should get all todos", (done) => {
            supertest(app)
            .get("/todos")
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((response) => {
                expect(response.body.todos.length).toBe(1);
            })
            .end(done);
        });
    });

    describe("GET /todos/:id", () => {
        it("should get todo document", (done) => {
            supertest(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
        });

        it("should return 404 if todo not found", (done) => {
            supertest(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .set("x-auth", users[0].tokens[0].token)
            .expect(404)
            .end(done);
        });

        it("should return 404 for non object ids", (done) => {
            supertest(app)
            .get("/todos/123abc")
            .set("x-auth", users[0].tokens[0].token)
            .expect(404)
            .end(done);
        });

        it("should not get todo document created by another user", (done) => {
            supertest(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set("x-auth", users[0].tokens[0].token)
            .expect(404)
            .end(done);
        });

    });

    describe("DELETE /todos/:id", () => {
        it("should delete todo document", (done) => {
            var id = todos[0]._id.toHexString();

            supertest(app)
            .delete(`/todos/${id}`)
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((response) => {
                // expect(response.body.todo.text).toBe(todos[0].text);
                expect(response.body.todo._id).toBe(id);
            })
            .end((error, response)=>{
                if(error) return done(error);
                
                Todo.findById(id).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((error) => done(error));
            });
        });

        it("should return 404 if todo not found", (done) => {
            supertest(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .set("x-auth", users[0].tokens[0].token)
            .expect(404)
            .end(done);
        });

        it("should return 404 for non object ids", (done) => {
            supertest(app)
            .delete("/todos/123abc")
            .set("x-auth", users[0].tokens[0].token)
            .expect(404)
            .end(done);
        });
        
        it("should not delete todo document created by another user", (done) => {
            var id = todos[1]._id.toHexString();

            supertest(app)
            .delete(`/todos/${id}`)
            .set("x-auth", users[0].tokens[0].token)
            .expect(404)
            .end((error, response)=>{
                if(error) return done(error);
                
                Todo.findById(id).then((todo) => {
                    expect(todo).toExist();
                    done();
                }).catch((error) => done(error));
            });
        });
    });

    describe("PATCH /todos/:id", () => {
        it("should update todo document", (done) => {
            var id = todos[0]._id.toHexString();
            var text = "Text is changed";

            supertest(app)
            .patch(`/todos/${id}`)
            .set("x-auth", users[0].tokens[0].token)
            .send({text, completed: true})
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(text);
                expect(response.body.todo.completed).toBe(true);
                expect(response.body.todo.completedAt).toExist()
            })
            .end(done);
        });

        it("should update todo document when created by other user", (done) => {
            var id = todos[0]._id.toHexString();
            var text = "Text is changed";

            supertest(app)
            .patch(`/todos/${id}`)
            .set("x-auth", users[1].tokens[0].token)
            .send({text, completed: true})
            .expect(404)
            .end(done);
        });

        it("should completedAt when todo is not completed", (done) => {
            var id = todos[1]._id.toHexString();
            var text = "Text is changed again";

            supertest(app)
            .patch(`/todos/${id}`)
            .set("x-auth", users[1].tokens[0].token)
            .send({text, completed: false})
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(text);
                expect(response.body.todo.completed).toBe(false);
                expect(response.body.todo.completedAt).toNotExist()
            })
            .end(done);

        });
    });
});

describe("Users", () => {
    describe("GET /users/me", () => {
        it("should return user if authenticated", (done) => {
            supertest(app)
            .get("/users/me")
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((response) => {
                expect(response.body._id).toBe(users[0]._id.toHexString());
                expect(response.body.email).toBe(users[0].email);
            })
            .end(done);
        });

        it("should return a 401 if not authenticated", (done) => {
            supertest(app)
            .get("/users/me")
            .expect(401)
            .expect((response) => {
                expect(response.body).toEqual({});
            })
            .end(done);
        });
    });

    describe("POST /users", () => {
        it("should create a user", (done) => {
            var email = "test@test.com";
            var password = "123456";

            supertest(app)
            .post("/users")
            .send({email, password})
            .expect(200)
            .expect((response) => {
                expect(response.headers["x-auth"]).toExist();
                expect(response.body._id).toExist();
                expect(response.body.email).toBe(email);
            })
            .end((error) => {
                if(error) return done(error);

                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((error) => done(error));
            });
        });

        it("should return validation errors if request invalid", (done) => {
            supertest(app)
            .post("/users")
            .send({email: "1234@test.com", password: "1234"})
            .expect(400)
            .end(done);
        });

        it("should not create user if email in use", (done) => {
            supertest(app)
            .post("/users")
            .send({email: users[0].email, password: "123456"})
            .expect(400)
            .end(done); 
        });
    }); 

    describe("POST /users/login", () => {
        it("should login user and return auth token", (done) => {
            supertest(app)
            .post("/users/login")
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((response) => {
                expect(response.headers["x-auth"]).toExist()
            })
            .end((error, response) => {
                if(error) return done();

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[1]).toInclude({
                        access: "auth",
                        token: response.headers["x-auth"]
                    });
                    done();
                }).catch((error) => done(error));
            });
        });

        it("should reject invalid login", (done) => {
            supertest(app)
            .post("/users/login")
            .send({
                email: users[1].email,
                password: users[1].password + "123"
            })
            .expect(400)
            .expect((response) => {
                expect(response.headers["x-auth"]).toNotExist()
            })
            .end((error, response) => {
                if(error) return done();

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1)
                    done();
                }).catch((error) => done(error));
            });
        });
    });

    describe("DELETE /users/me/token", () => {
        it("should remove auth token on logout", (done) => {
            supertest(app)
            .delete("/users/me/token")
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((response) => {
                expect(response.headers["x-auth"]).toNotExist()
            })
            .end((error, response) => {
                if(error) return done();

                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0)
                    done();
                }).catch((error) => done(error));
            });
        });
    })
});
