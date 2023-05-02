const mongoose = require('mongoose');
const usersSchema = new mongoose.Schema({
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 84b9dc8c07ff50b99f6a30a1f95fca585ac987b5
  "username": {
    type: String,
    unique: true,
  },
  "password": String,
  "type": String,
<<<<<<< HEAD
  "todos": [
=======
  "todos":[
=======
  "username": String,
  "password": String,
  "type": String,
  "todos": [
>>>>>>> cc19df961c8378072fbfbfe02775312b45c72ae0
>>>>>>> 84b9dc8c07ff50b99f6a30a1f95fca585ac987b5
    {
      "name": String,
      "done": {
        type: Boolean,
<<<<<<< HEAD
        default: false
=======
<<<<<<< HEAD
        default: false,
=======
        default: false
>>>>>>> cc19df961c8378072fbfbfe02775312b45c72ae0
>>>>>>> 84b9dc8c07ff50b99f6a30a1f95fca585ac987b5
      }
    }
  ]
});


const usersModel = mongoose.model('w2users', usersSchema);

module.exports = usersModel;