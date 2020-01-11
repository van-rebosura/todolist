// jshint esversion: 6

// app dependencies
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

// express init
const app = express();

// app specific variables
let list = [];
let work = [];
let day;
let dayOptions = {
  weekday: "long",
  month: "long",
  day: "numeric"
};
let localeDate;


// static folder
app.use(express.static("public"));

// body-parser
app.use(bodyParser.urlencoded({
  extended: true
}));

// EJS
app.set('view engine', 'ejs');

// server init
app.listen(process.env.PORT || 3000, () => {
  console.log("server is now running");
});

// root route
app.get("/", (req, res) => {

  day = new Date();

  // converts date to displayable format
  localeDate = day.toLocaleDateString("en-US", dayOptions);

  todoListRenderer("/", res);

});

// triggered when plus button is clicked
app.post("/", (req, res) => {

  let newListItem = req.body.newListItem;

  let route = req.body.route;

  // add item to the appropriate list
  if (route === "work") {
    addItem(newListItem, work);
    res.redirect("/work");
  } else {
    addItem(newListItem, list);
    res.redirect("/");
  }

});

// work route
app.get('/work', (req, res) => {
  todoListRenderer("work", res);
});

function addItem(listItem, itemArray) {
  itemArray.push(listItem);
}

// takes string route and response object res
// does the view rendering using ejs

function todoListRenderer(route, res) {

  let title;
  let currentList;

  if (route === '/') {
    localeDate = day.toLocaleDateString("en-US", dayOptions);
    title = localeDate;
    currentList = list;
  } else {
    title = route;
    currentList = work;
  }

// Embedded JS variables
  let ejsVariables = {
    listTitle: title,
    todoList: currentList
  }

  res.render('index', ejsVariables);

}
