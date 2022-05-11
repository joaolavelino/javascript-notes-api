//--PART EIGHT-2---
const express = require("express");
const router = express.Router();
const Note = require("../models/note");
//6--PART EIGHT-6---
const withAuth = require(`../middlewares/auth`);

//--CREATE A NEW NOTE--
router.post("/", withAuth, async (req, res) => {
  //get the info from the request body
  const { title, body } = req.body;
  //create a new note with those infos (the author is from the request user provided by the WithAuth middleware)
  try {
    let note = new Note({ title: title, body: body, author: req.user._id });
    //try to save the note
    await note.save();
    //if it succeds, respond with the success status and the created note
    res.status(200).json(note);
  } catch (error) {
    //if it doesn't, throw the internal sever error status and an error
    res.status(500).json({ error: "Problems on creating new note" });
  }
});

//--GET NOTE LIST BY USER---
router.get("/", withAuth, async (req, res) => {
  try {
    const notes = await Note.find({ author: req.user._id });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: "Problems on getting the list notes" });
  }
});

//--SEARCHING FOR A NOTE --
//**  THIS NOTE MUST GO BEFORE THE ROUTES WITH ID
router.get("/search", withAuth, async (req, res) => {
  //pick the query value from the request
  const { query } = req.query;
  console.log(query);
  try {
    let notes = await Note.find({ author: req.user._id }).find({
      $text: { $search: query },
    });
    //after retrieving the list, there will be another search - $text is an index that represent the fields that have text value (this is defined in the note model)
    res.status(200).json(notes);
  } catch (error) {
    res.json({ error: error }).status(500);
  }
});

//--GET NOTE BY ID---
router.get("/:id", withAuth, async (req, res) => {
  const { id } = req.params;
  try {
    let note = await Note.findById(id);
    //use this created method to check if the user is the owner
    if (isOwner(req.user, note)) res.status(200).json(note);
    else
      res.status(403).json({
        error: "Permission Denied. The note is only available to its author",
      });
  } catch (error) {
    res.status(500).json({ error: "Problems on getting the note" });
  }
});

//--UPDATE NOTE
router.put("/:id", withAuth, async (req, res) => {
  //gather the info from the request
  const { title, body } = req.body;
  const { id } = req.params;
  try {
    let note = await Note.findById(id);
    if (isOwner(req.user, note)) {
      let note = await Note.findByIdAndUpdate(
        id,
        { $set: { title: title, body: body } },
        { upsert: true, new: true }
      );
      res.status(200).json(note);
    } else {
      res.status(403).json({
        error: "Permission Denied. The note is only available to its author",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Problems on updating the note" });
  }
});

//--DELETE A NOTE--
router.delete("/:id", withAuth, async (req, res) => {
  const { id } = req.params;
  try {
    let note = await Note.findById(id);
    if (isOwner(req.user, note)) {
      await note.deleteOne();
      //status 204 - successfully deleted
      res.json({ message: "Note successfully deleted" }).status(204);
    } else {
      res.status(403).json({
        error: "Permission Denied. The note is only available to its author",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting the note" });
  }
});

//--PART NINE-2 --- Creating a method to check if the user is the owner of the note.
//this will use the user info provided by the withAuth middleware
const isOwner = (user, note) => {
  if (JSON.stringify(user._id) == JSON.stringify(note.author)) return true;
  else return false;
};

module.exports = router;
