//1 - Import mongoose
const mongoose = require("mongoose");
//2 - Connect mongoose with the global promise
mongoose.Promise = global.Promise;
//DEPLOY - require the environment
require("dotenv").config();
const MONGO_URL = process.env.MONGO_URL;

//3 - Connect with the DB (commented on the deploy stage)
mongoose
  // .connect("mongodb://localhost/javascriptnote", {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  //   // useCreateIndex: true, THIS IS NO LONGER SUPPORTED - it's automatically set to true
  // })
  //DEPLOY - change the adress of the database to the actual adress on the cloud
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true, THIS IS NO LONGER SUPPORTED - it's automatically set to true
  })
  .then(() => console.log("Connection Successful"))
  .catch((err) => console.log(err));
