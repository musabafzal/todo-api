const expect = require('expect')
const request = require('supertest')

const {app} = require('./server')
const {Todo} = require('./models/todo')
var {ObjectID} = require('mongodb')

const todos = [{
  _id: new ObjectID(),
  text: 'First'
}, {
  _id: new ObjectID(),
  text: 'Second'
}, {
  _id: new ObjectID(),
  text: 'Third'
}]

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos)
  }).then(() => {
    done()
  })
})

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text'
    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text)
      })
      .end((err, res) => {
        if(err){
          return done(err)
        }
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1)
          expect(todos[0].text).toBe(text)
          done()
        }).catch((err) => {
          done(err)
        })
      })
  })

  it('should not create todo with invalid body data', (done) => {
    var text = ""

    request(app)
      .post('/todos')
      .send({text})
      .expect(400)
      .end((err, res) => {
        if(err) {
          return done(err)
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(3)
          done()
        }).catch((err) => {
          done(err)
        })
      })
  })
})

describe('GET /todos', () => {
  it('should g et all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(3)
      })
      .end(done)
  })
})

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)
  })
})