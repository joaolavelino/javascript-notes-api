const mongoose = require("mongoose");

//1 - Require bcrypt
const bcrypt = require("bcrypt");

let userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

//2 - this middleware will run before the data is called
//1st arg - is the action that will trigger the middleware
//2nd will trigger the next one (as every middleware on express)
userSchema.pre("save", function (next) {
  //this function will run only when the user is new or changes the password - it will transform the password in a hash
  if (this.isNew || this.isModified("password")) {
    //that second argument below is the number of hash chars
    bcrypt.hash(this.password, 10, (err, hashedPassword) => {
      if (err) {
        next(err);
      } else {
        this.password = hashedPassword;
        next();
      }
    });
  }
});

//--Part six--user authentification - create a method to check the password
userSchema.methods.isCorrectPassword = function (password, callback) {
  //this will compare the password given on the function call with the password in the object of the user (this) and throw
  bcrypt.compare(password, this.password, function (err, same) {
    if (err) callback(err);
    else callback(err, same);
  });
};

module.exports = mongoose.model("User", userSchema);
