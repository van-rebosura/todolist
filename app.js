// jshint esversion: 6

// app dependencies
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

// express init
const app = express();

// app specific variables
let list = [];
let day;
let dayOptions = {
  weekday: "long",
  month: "long",
  day: "2-digit"
};
let localeDate;


// static folder
app.use(express.static("public"));

// body-parser
app.use(bodyParser.urlencoded({
  extended: true
}));

// ejs
app.set('view engine', 'ejs');

// server init
app.listen(3000, () => {
  console.log("server running at port 3000");
});

// root route
app.get("/", (req, res) => {

  day = new Date();

  // converts date to displayable format
  localeDate = day.toLocaleDateString("en-US", dayOptions);

  // renders 'view/index.ejs'
  res.render('index', {
    currentDate: localeDate,
    todoList: list
  });

});

app.post("/", (req, res) => {

  let newListItem = req.body.newListItem;

  // add item to the list
  list.push(newListItem);

  res.redirect("/");

})
