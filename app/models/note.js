//1 - Require mongoose
const mongoose = require("mongoose");

//2 - create schema
let noteSchema = new mongoose.Schema({
  title: String,
  body: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  //specify the relation with the user
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

//--PART 13 - Create search index
noteSchema.index({ title: "text", body: "text" });
//it's basically creating an index that will represent both of the fields. so when I search for $text, it's clear that i'm searching on these fields only.

//3 - export the schema
module.exports = mongoose.model("Note", noteSchema);
