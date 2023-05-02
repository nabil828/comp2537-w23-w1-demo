const express = require('express');
const app = express();
const session = require('express-session');
const usersModel = require('./models/w2users');
const bcrypt = require('bcrypt');

// 1 - import 
let ejs = require('ejs');
// 2 - set the view engine to ejs
// app.set('view engine', 'ejs')

var MongoDBStore = require('connect-mongodb-session')(session);


const dotenv = require('dotenv');
dotenv.config();


var dbStore = new MongoDBStore({
  // uri: 'mongodb://localhost:27017/connect_mongodb_session_test',
  uri: `mongodb+srv://${process.env.ATLAS_DB_USER}:${process.env.ATLAS_DB_PASSWORD}@cluster0.lbm8g.mongodb.net/comp2537w1?retryWrites=true&w=majority`,
  collection: 'mySessions'
});


// replace the in-memory array session store with a database session store
app.use(session({
  secret: `${process.env.SESSIONS_SECRET}`,
  store: dbStore,
  resave: false,
  saveUninitialized: false,
}));

// public routes
app.get('/', (req, res) => {
  res.send('<h1> Hello World </h1>');
});


app.get('/login', (req, res) => {
  res.send(`
    <form action="/login" method="post">
      <input type="text" name="username" placeholder="Enter your username" />
      <input type="password" name="password" placeholder="Enter your password" />
      <input type="submit" value="Login" />
    </form>
  `)

});

// GLOBAL_AUTHENTICATED = false;
app.use(express.urlencoded({ extended: false }))
// built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser.
const Joi = require('joi');
app.use(express.json()) // built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
app.post('/login', async (req, res) => {
  // set a global variable to true if the user is authenticated

  // sanitize the input using Joi
  const schema = Joi.object({
    password: Joi.string()
  })

  try {
    console.log("req.body.password " + req.body.password);
    const value = await schema.validateAsync({ password: req.body.password });
  }
  catch (err) {
    console.log(err);
    console.log("The password has to be a string");
    return
  }

  try {
    const result = await usersModel.findOne({
      username: req.body.username
    })
    // console.log(result?.password);
    // if (bcrypt.compareSync(req.body.password, result?.password)) {
    if (req.body.password == result?.password) {
      req.session.GLOBAL_AUTHENTICATED = true;
      req.session.loggedUsername = req.body.username;
      req.session.loggedPassword = req.body.password;
      req.session.loggedType = result?.type;
      res.redirect('/protectedRoute');
    } else {
      res.send('wrong password')
    }

  } catch (error) {
    console.log(error);
  }

});


// app.get('*', (req, res) => {


//   res.status(404).send('<h1> 404 Page not found</h1>');
// });



// only for authenticated users
const authenticatedOnly = (req, res, next) => {
  if (!req.session.GLOBAL_AUTHENTICATED) {
    return res.status(401).json({ error: 'not authenticated' });
  }
  next(); // allow the next route to run
};
app.use(authenticatedOnly);

app.use(express.static('public')) // built-in middleware function in Express. It serves static files and is based on serve-static.

app.get('/protectedRoute', async (req, res) => {
  // serve one of the three images randomly
  // generate a random number between 1 and 3
  const randomImageNumber = Math.floor(Math.random() * 3) + 1;
  const imageName = `00${randomImageNumber}.png`;


  // let us get the todos from the database
  const result = await usersModel.findOne({ username: req.session.loggedUsername })


  // 3 - send data to the ejs template
  res.render('protectedRoute.ejs', {
    "x": req.session.loggedUsername,
    "y": imageName,
    "isAdmin": req.session.loggedType == 'administrator',
    "todos": result?.todos
  }
  )
});


app.post('/AddNewTodo', async (req, res) => {
  // 1 - add the item to db
  console.log(req.session.loggedUsername);
  const result = await usersModel.updateOne(
    { username: req.session.loggedUsername }, // the selection criteria
    {
      $push: {
        todos: {
          "name": req.body.name
        }
      } // the update action
    } // the update action
  )
  console.log(result);
  // 2 - redirect to the protected route
  res.redirect('/protectedRoute');
})


app.post('/flipToDoItem', async (req, res) => {
  // 1 - to find the user and the todo item
  // 2- flip the value of the done property
  const result = await usersModel.findOne({
    username: req.session.loggedUsername
  })
  const newArr = result.todos.map((item) => {
    if (item.name == req.body.name) {
      item.done = !item.done;
    }
    return item;
  })
  const updateResult = await usersModel.updateOne(
    { username: req.session.loggedUsername }, // the selection criteria
    {
      $set: {
        todos: newArr
      }
    }
  )

  // 3 - redirect to the protected route
  res.redirect('/protectedRoute');
})

app.post('/deleteToDoItem', async (req, res) => {
  // 1 - to find the user and the todo item
  const result = await usersModel.findOne({
    username: req.session.loggedUsername
  })
  const newArr = result.todos.filter((item) => {
    return item.name != req.body.name;
  })

  // 2- delete the item from the array
  const updateResult = await usersModel.updateOne(
    { username: req.session.loggedUsername }, // the selection criteria
    {
      $set: {
        todos: newArr
      }
    }
  )


  // 3 - redirect to the protected route
  res.redirect('/protectedRoute');
})


// only for admins
const protectedRouteForAdminsOnlyMiddlewareFunction = async (req, res, next) => {
  try {
    const result = await usersModel.findOne({ username: req.session.loggedUsername }
    )
    if (result?.type != 'administrator') {
      return res.send('<h1> You are not an admin </h1>')
    }
    next(); // allow the next route to run
  } catch (error) {
    console.log(error);
  }
};
app.use(protectedRouteForAdminsOnlyMiddlewareFunction);

app.get('/protectedRouteForAdminsOnly', (req, res) => {
  res.send('<h1> protectedRouteForAdminsOnly </h1>');
});

app.get('*', (req, res) => {
  res.status(404).send('<h1> 404 Page not found</h1>');
});




module.exports = app;