const supertest = require("supertest");
const expect = require("expect");

const {app} = require("./../server");
const {Todo} = require("./../models/todo");
const {ObjectID} = require("mongodb");

const todos = [
    {
        _id: new ObjectID(), 
        text: "First test todo"
    },
    {
        _id: new ObjectID(), 
        text: "Second test todo"
    }
]

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});


describe("Post /todos", () => {
    it("should create a new todo", (done) => {
        var text = "Test todo text";

        supertest(app)
        .post("/todos")
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
        .expect(200)
        .expect((response) => {
            expect(response.body.todos.length).toBe(2);
        })
        .end(done);
    });
});

describe("GET /todos/:id", () => {
    it("should get todo document", (done) => {
        supertest(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((response) => {
            expect(response.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it("should return 404 if todo not found", (done) => {
        supertest(app)
        .get(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .end(done);
    });

    it("should return 404 for non object ids", (done) => {
        supertest(app)
        .get("/todos/123abc")
        .expect(404)
        .end(done);
    });
});


describe("DELETE /todos/:id", () => {
    it("should delete todo document", (done) => {
        var id = todos[0]._id.toHexString();

        supertest(app)
        .delete(`/todos/${id}`)
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
        .expect(404)
        .end(done);
    });

    it("should return 404 for non object ids", (done) => {
        supertest(app)
        .delete("/todos/123abc")
        .expect(404)
        .end(done);
    });
});
