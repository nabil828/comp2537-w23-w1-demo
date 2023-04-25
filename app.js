const express = require('express');
const app = express();
const session = require('express-session');
const usersModel = require('./models/w1users');
const bcrypt = require('bcrypt');

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
  secret: 'the secret is sky color is blue ', // bad secret
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

app.post('/login', async (req, res) => {
  // set a global variable to true if the user is authenticated
  try {
    const result = await usersModel.findOne({
      username: req.body.username
    })

    if (bcrypt.compareSync(req.body.password, result?.password)) {
      req.session.GLOBAL_AUTHENTICATED = true;
      req.session.loggedUsername = req.body.username;
      req.session.loggedPassword = req.body.password;
      res.redirect('/');
    } else {
      res.send('wrong password')
    }

  } catch (error) {
    console.log(error);
  }

});


app.get('*', (req, res) => {
  res.status(404).send('<h1> 404 Page not found</h1>');
});



// only for authenticated users
const authenticatedOnly = (req, res, next) => {
  if (!req.session.GLOBAL_AUTHENTICATED) {
    return res.status(401).json({ error: 'not authenticated' });
  }
  next(); // allow the next route to run
};
app.use(authenticatedOnly);

app.use(express.static('public')) // built-in middleware function in Express. It serves static files and is based on serve-static.

app.get('/protectedRoute', (req, res) => {
  // serve one of the three images randomly
  // generate a random number between 1 and 3
  const randomImageNumber = Math.floor(Math.random() * 3) + 1;
  const imageName = `00${randomImageNumber}.png`;
  HTMLResponse = `
    <h1> Protected Route </h1>
    <br>
    <img src="${imageName}" />
    `
  res.send(HTMLResponse);
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