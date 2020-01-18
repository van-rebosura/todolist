// jshint esversion: 6

// app dependencies
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');


// express init
const app = express();

// app specific variables
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

// db connection

let mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose.connect('mongodb://localhost:27017/todolistDB', mongoOptions, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('connection to db successful');;
  }
});

// item schema

const itemSchema = {
  name: {
    type: String,
    required: true
  }
};

// item model

const Item = new mongoose.model('Item', itemSchema);

// root route
app.get("/", (req, res) => {

  day = new Date();

  // check if todolist has contents

  Item.find({}, (err, items) => {
    if (items.length === 0) {

      const item0 = createItem('Hello and welcome to your list!');
      const item1 = createItem('Click the plus button to add a new entry!');
      const item2 = createItem('<--- Click here to cross off an entry!');

      let initialItems = [item0, item1, item2];

      Item.insertMany(initialItems, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

      let ejsVariables = {
        listTitle: "Today",
        todoList: items
      };

      res.render('index', ejsVariables);
  });

  // converts date to displayable format
  // localeDate = day.toLocaleDateString("en-US", dayOptions);



});

// triggered when plus button is clicked
app.post("/", (req, res) => {

  let newListItem = req.body.newListItem;

  let item = createItem(newListItem);
  item.save();

  let route = req.body.route;

  // add item to the appropriate list
  if (route === "work") {
    // addItem(newListItem, work);
    res.redirect("/work");
  } else {
    // addItem(newListItem, list);

    res.redirect("/");
  }

});

// work route
app.get('/work', (req, res) => {
  todoListRenderer("work", res);
});



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
    listTitle: "Today",
    todoList: currentList
  }

  res.render('index', ejsVariables);

}


function createItem(name) {
  return new Item({
    name: name
  });
}
