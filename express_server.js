const express = require("express");
const app = express();
const PORT = 8080; //default port is 8080

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "shortboi": "www.shortboi.com"
};

app.use(express.urlencoded({ extended: true }));

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
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const shortURL = generateRandomString()
  urlDatabase[shortURL] = req.body.longURL
  console.log(urlDatabase)
  // res.send("Ok"); // Respond with 'Ok' (we will replace this)'
  res.redirect(`/urls/:${shortURL}`) //issue - doesn't get longURL 
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]
  res.redirect(longURL);
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id]
  res.redirect("/urls")
});