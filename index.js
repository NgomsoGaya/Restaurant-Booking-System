import express from "express";
import pgp from "pg-promise";
import exphbs from "express-handlebars";
import bodyParser from "body-parser";
import flash from "flash-express";
import restaurant from "./services/restaurant.js";
import 'dotenv/config'


import pgPromise from "pg-promise";


const DATABASE_URL =
  "postgres://nrctmphn:s45gJviodAqi86B2Wth1bx5JWzeC-NbO@dumbo.db.elephantsql.com/nrctmphn";

const connectionString = process.env.DATABASE_URL || DATABASE_URL;

const db = pgPromise()(connectionString);
    
const app = express()

app.use(express.static('public'));
app.use(flash());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const handlebarSetup = exphbs.engine({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

const factory = restaurant(db)

app.get("/", async (req, res) => {
    //create an intance for tables
    let table = await factory.getTables()
   

    //console.log(table)

    //render them accordingly
    res.render("index", {
        tables: table
    });
        
});

app.post("/book", async (req, res) => {
  //let table = await factory.getTables();

   // access all the inputs
  let userName = req.body.username;
  let NumberOfPeople = req.body.booking_size;
  let CellNo = req.body.phone_number;
  let tableRadio = req.body.tableId;

    //console.log(tableRadio);
    //create an instance
  let message = await factory.bookTable({
    tableRadio,
    userName,
    CellNo,
    NumberOfPeople,
  });

    //render the messages accordingly
  res.render("index", { message });

  // res.redirect("/")
})

app.get("/bookings", (req, res) => {

    res.render('bookings', { tables : [{}, {}, {}, {}, {}, {}]})
});


var portNumber = process.env.PORT || 3000;

//start everything up
app.listen(portNumber, function () {
    console.log('🚀  server listening on:', portNumber);
});