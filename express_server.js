const express = require("express");
const app = express();
const PORT = 8080; //default port is 8080
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//databases and helpers
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "shortboi": "www.shortboi.com"
};

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

const users = {};

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

//render urls_index
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user: users[req.cookies['user_id']] };
  res.render("urls_index", templateVars);
});

//route for urls/new
app.get("/urls/new", (req, res) => {
  const templateVars = { urls: urlDatabase, user: users[req.cookies['user_id']] };
  res.render("urls_new", templateVars);
});
//route for urls/:id
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], user: users[req.cookies['user_id']]  };
  res.render("urls_show", templateVars);
});

//post request for /urls route - generate shortURL and redirect user to URL
app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase);
  // res.send("Ok"); // Respond with 'Ok' (we will replace this)'
  res.redirect(`/urls/:${shortURL}`) //issue - doesn't get longURL 
});
//redirect shortURL to long URL
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

// Update long URL 
app.post('/urls/:id', (req, res) => {
  const longURL = req.body.longURL;
  urlDatabase[req.params.id] = longURL;
  res.redirect('/urls');
});
// delete URL
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

//handle POST to /login - set a cookie and redirect back to /urls
app.post('/login', (req, res) => {
  const { username } = req.body;
  res.cookie('username', username);
  res.redirect('/urls');
});

//clear cookie from login
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

//get request to render registration
app.get('/registration', (req, res) => {
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
  res.cookie('user_id', userID)
  console.log(users)
  console.log(req.body.email)
  res.redirect('/urls');
});

app.get('/login', (req, res) => {
  const templateVars = { user: users[req.cookies['user_id']] };
  res.render('login', templateVars)
})