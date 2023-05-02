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
    // if (bcrypt.compareSync(req.body.password, result?.password)) {
    if (req.body.password == result?.password) {
    // if (bcrypt.compareSync(req.body.password, result?.password)) {
    if (req.body.password == result?.password) {
      req.session.GLOBAL_AUTHENTICATED = true;
      req.session.loggedUsername = req.body.username;
      req.session.loggedPassword = req.body.password;
      req.session.loggedType = result?.type;
      res.redirect('/protectedRoute');
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

  const result = await usersModel.findOne({ username: req.session.loggedUsername })

  // HTMLResponse = `
  //   Hello ${req.session.loggedUsername}!
  //   <h1> Protected Route </h1>
  //   <br>
  //   <img src="${imageName}" />
  //   `
  // res.send(HTMLResponse);

  // 3 - send data to the ejs template
  const result = await usersModel.findOne({ username: req.session.loggedUsername })

  res.render('protectedRoute.ejs', {
    "x": req.session.loggedUsername,
    "y": imageName,
    "isAdmin": req.session.loggedType == 'administrator',
    "todos": result?.todos
  }
  )
});

app.post('/addNewToDoItem', async (req, res) => {
  // 1 - find the user in the database
  const result = usersModel.findOne({ username: req.session.loggedUsername })

  // 2- add the new todo item to the todos array
  // 3 - update the user in the database
  const updateResult = await usersModel.updateOne(
    { username: req.session.loggedUsername }, // selection object
    { $push: { todos: { "name": req.body.x } } } // update object
  )
  // console.log("updateResult:" + updateResult);
  // 4 - redirect to the protected route
  res.redirect('/protectedRoute');
});


app.post('/deleteTodoItem', async (req, res) => {
  // 1 - find the user in the database
  const result = await usersModel.findOne({ username: req.session.loggedUsername })

  // 2- delete the todo item from the todos array
  const newArr = result.todos.filter((todoItem) =>
    todoItem.name != req.body.x
  )

  // 3 - update the user's todos array in the database
  const updateResult = await usersModel.updateOne(
    { username: req.session.loggedUsername }, // selection object
    { $set: { todos: newArr } } // update object
  )

  // 4 - redirect to the protected route
  res.redirect('/protectedRoute');
});

app.post('/flipTodoItem', async (req, res) => {
  try {
    // 1 - find the user in the database
    const result = await usersModel.findOne({ username: req.session.loggedUsername })

    // 2 - flip the todo item in the todos array
    const newArr = result.todos.map((todoItem) => {
      if (todoItem.name == req.body.x) {
        todoItem.done = !todoItem.done;
      }
      return todoItem;
    })

    // 3 - update the user's todos array in the database
    const updateResult = await usersModel.updateOne(
      { username: req.session.loggedUsername }, // selection object
      { $set: { todos: newArr } } // update object
    )

    // 4 - redirect to the protected route
    res.redirect('/protectedRoute');

  } catch (error) {
    console.log(error);
  }
});

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