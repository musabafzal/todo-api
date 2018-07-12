const {mongoose} = require('./../db/mongoose')
const {Todo} = require('./../models/todo')
const {ObjectID} = require('mongodb')

var id = '5b46551ddbccaf0371316d32'

if(!ObjectID.isValid(id)){
  return console.log("ID not valid")
}
// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos)
// })

// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo)
// })

Todo.findById(id).then((todo) => {
  if(!todo) {
    return console.log('ID not found')
  }
  console.log('Todo by ID', todo)
}).catch((e) => {
  console.log(e)
})