// jshint esversion: 6

// app dependencies
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');


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

// default list route

// app.get("/defaultList", (req, res) => {
//     // check if todolist has contents
//
//     Item.find({}, (err, items) => {
//       if (items.length === 0) {
//
//         Item.insertMany(initialItems, (err) => {
//           if (err) {
//             console.log(err);
//           }
//         });
//
//       }
//
//       let ejsVariables = {
//         listId: "root",
//         listTitle: "Today",
//         todoList: items
//       };
//
//       res.render('index', ejsVariables);
//     });
// });

// custom list route

app.get("/:customListName", (req, res) => {
  let customListName = req.params.customListName;

  if (customListName === "defaultList" ) {
    customListName = "Today";
  }

  // check if list exists

  List.findOne({
    name: customListName
  }, (err, list) => {
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
  // item.save();

  List.findOneAndUpdate({_id: listId}, {$push: {items: item}}, (err) => {
    res.redirect("/" + listName);
  });


});

// delete action

app.post("/delete", (req, res) => {
  const itemId = (req.body.checkboxItem);

  Item.findOneAndDelete(itemId, (err) => {
    if (!err) {
      res.redirect("/");
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
