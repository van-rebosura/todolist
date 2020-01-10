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
app.listen(process.env.PORT || 3000, () => {
  console.log("server is now running");
});

// root route
app.get("/", (req, res) => {

  day = new Date();

  // converts date to displayable format
  localeDate = day.toLocaleDateString("en-US", dayOptions);

  // renders 'view/index.ejs'
  // res.render('index', {
  //   currentDate: localeDate,
  //   todoList: list
  // });

  todoListRenderer("/", res);

});

app.post("/", (req, res) => {

  let newListItem = req.body.newListItem;

  // add item to the list
  let arr = addItem(newListItem, list);

  res.redirect("/");

});

// test serve work route

app.get('/work', (req, res) => {
  todoListRenderer("work", res);
});

function addItem(listItem, itemArray) {
  itemArray.push(listItem);
  return itemArray;
}

function todoListRenderer(route, res) {

  let title;
  let currentList;

  if(route === '/') {
    localeDate = day.toLocaleDateString("en-US", dayOptions);
    title = localeDate;
    currentList = list;
  } else {
    title = route;
    currentList = work;
  }

  let ejsVariables = {
    listTitle: title,
    todoList: currentList
  }

  res.render('index', ejsVariables);

}
