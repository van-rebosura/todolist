// jshint esversion: 6

// app dependencies
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const _ = require('lodash');


// express init
const app = express();


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

let mongodbConnection = "mongodb+srv://admin:admin@todolistdb-22zmr.gcp.mongodb.net/todoListDB";

mongoose.connect(mongodbConnection, mongoOptions, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('connection to db successful');;
  }
});

mongoose.set('useFindAndModify', false);

// item schema

const itemSchema = {
  name: {
    type: String,
    required: true
  }
};

// item model

const Item = new mongoose.model('Item', itemSchema);

// list schema

const listSchema = {
  name: {
    type: String,
    required: true
  },
  items: {
    type: [itemSchema]
  }
};

// list model

const List = new mongoose.model('List', listSchema);


// app specific variables

let day;
let dayOptions = {
  weekday: "long",
  month: "long",
  day: "numeric"
};
let localeDate;

const item0 = createItem('Hello and welcome to your list!');
const item1 = createItem('Click the plus button to add a new entry!');
const item2 = createItem('<--- Click here to cross off an entry!');

let initialItems = [item0, item1, item2];

// root route
app.get("/", (req, res) => {

  // redirect to default listTitle

  res.redirect("/defaultList");


  // day = new Date();
  // converts date to displayable format
  // localeDate = day.toLocaleDateString("en-US", dayOptions);

});



// custom list route

app.get("/:customListName", (req, res) => {
  let customListName = _.capitalize(req.params.customListName);

  if (customListName === "defaultList" ) {
    customListName = "Today";
  }

  // check if list exists

  List.findOne({name: customListName}, (err, list) => {

    if (!err) {
      if (!list) {

        // push list to db
        const newList = createList(customListName);
        newList.save();

        let ejsVariables = {
          listId: newList._id,
          listTitle: customListName,
          todoList: initialItems
        };

        res.render('index', ejsVariables);
      } else {

        // redirect to existing list

        let ejsVariables = {
          listId: list._id,
          listTitle: list.name,
          todoList: list.items
        };

        res.render('index', ejsVariables);

      }
    }
  });

});


// triggered when plus button is clicked
app.post("/", (req, res) => {

  const listId = req.body.listId;
  const listName = req.body.listName;
  const newListItem = req.body.newListItem;
  const item = createItem(newListItem);

  // List.findOneAndUpdate({"_id": listId}, {$push: {items: item}}, (err) => {
  //   res.redirect("/" + listName);
  // });

  List.findOne({"_id": listId}, (err, foundList) => {
    if(err) {
      console.log(err);
    } else {
      if(foundList) {
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
      }
    }
  });


});

// delete action

app.post("/delete", (req, res) => {
  const listId = req.body.listId;
  const listName = req.body.listName;
  const itemId = req.body.itemId;


  List.findOneAndUpdate({"_id": listId}, {$pull: {items: {"_id": itemId}}}, (err, result) => {
    if(err) {
      console.log(err);
    } else {
      res.redirect("/" + listName);
    }
  });

});

function createItem(name) {
  return new Item({
    name: name
  });
}

function createList(name) {
  return new List({
    name: name,
    items: initialItems
  });
}
