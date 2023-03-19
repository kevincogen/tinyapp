const express = require("express");
const app = express();
const PORT = 8080; //default port is 8080
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//databases and helpers
const urlDatabase = {}
const users = {};
const generateRandomString = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  while (randomString.length < 6) {
    randomString += chars[Math.floor(Math.random() * chars.length)];
  }
  return randomString
};

const getUserByEmail = email => {
  for (const userID in users) {
    const user = users[userID]
    if (user.email === email) {
      return user
    }
  }
  return null;
};

const urlsForUser = (userid, database) => {
  const userURL = {};
  for (const id in database) {
    console.log(id)
    console.log(userid)
    if (database[id].userID === userid) {
      userURL[id] = database[id];
      console.log("matches!")
      console.log(database[id])
      console.log(userURL[id])
    }
  }
  return userURL;
};

//first iteration of requests
app.get("/", (req, res) => {
  res.send("Hello!");
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>hey <b>buddy</b></body></html>\n");
});

//GET /urls/ - render urls_index
app.get("/urls", (req, res) => {
  const userURLs = urlsForUser(req.cookies.user_id, urlDatabase)
  const templateVars = { urls: userURLs, user: users[req.cookies['user_id']] };
  // console.log(urlDatabase)
  // console.log(userURLs)
  // console.log(req.cookies.user_id)
  res.render("urls_index", templateVars);
});

//GET /urls/new - route for urls/new
app.get("/urls/new", (req, res) => {
  if (req.cookies.user_id) {
    const templateVars = { user: users[req.cookies['user_id']] };
    res.render("urls_new", templateVars);
  }
  res.redirect('/login')
});
//GET /urls/;id route for urls/:id
app.get("/urls/:id", (req, res) => {
  const userURLs = urlsForUser(req.cookies.user_id, urlDatabase);
  const templateVars = { urls: userURLs, user: users[req.cookies.user_id], id: req.params.id }
  res.render("urls_show", templateVars);
});

//POST URLS
app.post("/urls", (req, res) => {
  if (!req.cookies.user_id) {
    res.status(401).send("You must be logged in to shorten URLs.");
    return;
  }
  // console.log(req.body); // Log the POST request body to the console
  const id = generateRandomString();
  const user_id = req.cookies.user_id;
  urlDatabase[id] = {
    longURL: req.body.longURL,
    userID: user_id
  }
  // console.log(urlDatabase);
  // res.send("Ok"); // Respond with 'Ok' (we will replace this)'
  res.redirect(`/urls/${id}`); //issue - doesn't get longURL 
});

//GET u/:id redirect shortURL to long URL.
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;
  if (!longURL) {
    res.status(404).send("Error 404: The requested URL does not exist.");
  } else {
    res.redirect(longURL);
  }
});

// POST URLS/:id - Update long URL 
app.post('/urls/:id', (req, res) => {
  const longURL = req.body.longURL;
  urlDatabase[req.params.id].longURL = longURL;
  res.redirect('/urls');
});
// POST Delete
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

//POST login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email);
  if (!user) {
    res.status(403).send("This Email is not associated with a Registered User");
    return;
  }
  if (user.password !== password) {
    res.status(403).send("Password entered does not match");
    return;
  }
  res.cookie('user_id', user.userID);
  res.redirect('/urls');
});

//clear cookie at Logout
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});

//GET Registration
app.get('/registration', (req, res) => {
  if (req.cookies.user_id) {
    res.redirect('/urls');
    return;
  }
  const templateVars = { user: users[req.cookies['user_id']] };
  res.render("registration", templateVars);
});


//post endpoint for /register - add to users object
//include registration errors
app.post('/registration', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Email and password fields cannot be empty.");
    return;
  }
  const user = getUserByEmail(email);
  if (user) {
    res.status(400).send("Email already exists.");
    return;
  }
  const userID = generateRandomString()
  users[userID] = {
    userID,
    email: req.body.email,
    password: req.body.password
  }
  res.cookie('user_id', userID);
  console.log(users);
  console.log(req.body.email);
  res.redirect('/urls');
});

//get request render login
app.get('/login', (req, res) => {
  if (req.cookies.user_id){
    res.redirect('/urls');
    return;
  }
  const templateVars = { user: users[req.cookies['user_id']] };
  res.render('login', templateVars);
});