const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err) {
    return console.log('Unable to connect to db')
  } 
  console.log('Connected')

  var db = client.db()

//   db.collection('Todos').insertOne({
//     text: 'Something to do',
//     completed: false
//   }, (err, result) => {
//     if(err) {
//       return console.log('Unable to insert todo', err)
//     }
//     console.log(JSON.stringify(result.ops, undefined, 2))
//  })

  db.collection('Users').insertOne({
    name: 'Musab Afzal',
    age: 22,
    location: 'Pakistan'
  }, (err, result) => {
    if(err) {
      return console.log('Unable to insert todo', err)
    }
    console.log(JSON.stringify(result.ops, undefined, 2))
  })

  client.close()
})