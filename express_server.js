const express = require("express");
const app = express();
const PORT = 8080; //default port is 8080
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "shortboi": "www.shortboi.com"
};

const generateRandomString = () => {
// chars variable contains all characters to be used
//while loop runs while randomString is less than 6. 
//every iteration of loop adds char[index] to randomString
//[index expression] generates a random number between 0 and 62, rounds it to nearest integer
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  
  while (randomString.length < 6) {
    randomString += chars[Math.floor(Math.random() * chars.length)];
  }
  return randomString
};

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

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies['username'] };
  res.render("urls_index", templateVars);
});

//route for urls/new
app.get("/urls/new", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies['username'] };
  res.render("urls_new", templateVars);
});
//route for urls/:id
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], username: req.cookies['username']  };
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
  res.clearCookie('username');
  res.redirect('/urls');
});
