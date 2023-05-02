/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use('comp2537w2');

// Insert a few documents into the sales collection.
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> cc19df961c8378072fbfbfe02775312b45c72ae0
db.getCollection('w2users').insertMany([
  {
    username: 'admin',
    password: 'admin',
    type: 'administrator',
<<<<<<< HEAD
    todos:
      [
        { name: "todo1", done: false },
        { name: "todo2", done: true },
        { name: "todo3", done: false }
      ]
=======
    todos: [
      { name: "todo1", done: false },
      { name: "todo2", done: true },
      { name: "todo3", done: false }
    ]
>>>>>>> cc19df961c8378072fbfbfe02775312b45c72ae0
  },
  {
    username: 'user1',
    password: 'pass1',
    type: 'non-administrator',
    todos: [
      { name: "todo1", done: false },
      { name: "todo2", done: true },
      { name: "todo3", done: false }
    ]
  }
]);
<<<<<<< HEAD

=======
=======
>>>>>>> 84b9dc8c07ff50b99f6a30a1f95fca585ac987b5
// db.getCollection('w2users').insertMany([
//   {
//     username: 'admin',
//     password: 'admin',
//     type: 'administrator',
//     todos: [
//       { name: "todo1", done: false },
//       { name: "todo2", done: true },
//       { name: "todo3", done: false }
//     ]
<<<<<<< HEAD
=======

>>>>>>> 84b9dc8c07ff50b99f6a30a1f95fca585ac987b5
//   },
//   {
//     username: 'user1',
//     password: 'pass1',
//     type: 'non-administrator',
<<<<<<< HEAD
=======
//     type: 'administrator',
>>>>>>> 84b9dc8c07ff50b99f6a30a1f95fca585ac987b5
//     todos: [
//       { name: "todo1", done: false },
//       { name: "todo2", done: true },
//       { name: "todo3", done: false }
//     ]
//   }
// ]);
>>>>>>> 45dfc5fc95df1a595dd814c2c670be333a395834

<<<<<<< HEAD
=======
db.getCollection('w2users').update(
  { username: 'admin' }
  ,
  {
    $set: {
      todos: [
        { name: "todo1", done: false },
        { name: "todo2", done: true },
        { name: "todo3", done: false }
      ]

    }
  },
);
>>>>>>> cc19df961c8378072fbfbfe02775312b45c72ae0
>>>>>>> 84b9dc8c07ff50b99f6a30a1f95fca585ac987b5
db.w2users.find()