var express = require('express')
var bodyParser = require('body-parser')
var _ = require('lodash')
var bcrypt = require('bcryptjs')

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo')
var {User} = require('./models/user') 
var {ObjectID} = require('mongodb')
var {authenticate} = require('./middleware/authenticate')

const port = process.env.PORT || 8080

var app = express()

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  })
  todo.save().then((doc) => {
    res.send(doc)
  }, (err) => {
    res.status(400).send(err)
  })
})

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({
      todos
    })
  }, (err) => {
      res.status(400).send(err)
  })
})

app.get('/todos/:id', (req, res) => {
  var id = req.params.id
  if(!ObjectID.isValid(id)) {
    return res.status(404).send()
  }  
  Todo.findById(id).then((todo) => {
    if(!todo) {
      return res.status(404).send()
    }
    res.send({todo})
  }).catch(() => {
    res.send(400).send()
  })
})

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password'])
  var user = new User(body)

  user.save().then(() => {
    return user.generateAuthToken()
  }).then((token) => {
    res.set('x-auth', token).send(user)
  }).catch((err) => {
    res.status(400).send(err)
  })
})

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password'])

  User.findByCredentials(body.email, body.password).then((user) => {
    user.generateAuthToken().then((token) => {
      res.set('x-auth', token).send(user)
    })
  }).catch((err) => {
    res.status(401).send()
  })
})

app.get('/users/me', authenticate, (req,res) => {
  res.send(req.user)
})

app.listen(port, () => {
  console.log('Started on port', port)
})

module.exports = {
  app
}