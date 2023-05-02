const mongoose = require('mongoose');
const usersSchema = new mongoose.Schema({
<<<<<<< HEAD
  "username": {
    type: String,
    unique: true,
  },
  "password": String,
  "type": String,
  "todos":[
=======
  "username": String,
  "password": String,
  "type": String,
  "todos": [
>>>>>>> cc19df961c8378072fbfbfe02775312b45c72ae0
    {
      "name": String,
      "done": {
        type: Boolean,
<<<<<<< HEAD
        default: false,
=======
        default: false
>>>>>>> cc19df961c8378072fbfbfe02775312b45c72ae0
      }
    }
  ]
});


const usersModel = mongoose.model('w2users', usersSchema);

module.exports = usersModel;