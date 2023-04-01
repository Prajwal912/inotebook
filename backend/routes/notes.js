const express = require("express");
const Notes = require("../models/Notes");
let fetchUser = require("../middleware/fetchUser");
const { body, validationResult } = require("express-validator");
const router = express.Router();

//route 1: get all the notes using : GET "api/auth/getuser". Login req means auth token required
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    //fetch all data using fetchuser and user id which is present in fetchuser function of a particular user
    const notes = await Notes.find({ user: req.userDetails.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Something went wrong");
  }
});

//route 2: adding a note : POST "api/auth/addnote". Login req means auth token required with respect to a particulat auth token
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Enter a valid title").isLength({ min: 2 }),
    body("description", "Decsription atleast 5 character long").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      //if there are errors, return bad req and errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Notes({
        title,
        description,
        tag,
        user: req.userDetails.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Something went wrong");
    }
  }
);

//route 3: updating a note : POST "api/auth/updatenote". Login req means auth token required with respect to a particulat auth token
router.put("/updatenote/:id", fetchUser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    const newNote = {};
    //title mera phle se hai and wo bas mei empty obj newNote ke andar push kr rha hu taaki agar user ko update krna ho toh krle nhi toh title jaise ka waise hi rhe
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //find the note to be updated and update it

    //phle user ke notes ki id pakdi
    let note = await Notes.findById(req.params.id);

    //agar user empty hai toh koi update na kr ske
    if (!note) {
      return res.status(404).send("not found");
    }

    //agar mera user uski id ke barabar nhi hai toh
    if (note.user.toString() !== req.userDetails.id) {
      return res.status(401).send("not allowed");
    }

    //new true ka mtlb hai ki agar naya contact ata hai toh update ho hjayega
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Something went wrong");
  }
});

//route 4: deleting a note : POST "api/auth/deletenote". Login req means auth token required with respect to a particulat auth token
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  try {
    //find the note to be updated and update it

    //phle user ke notes ki id pakdi
    let note = await Notes.findById(req.params.id);

    //agar user empty hai toh koi delete na kr ske
    if (!note) {
      return res.status(404).send("not found");
    }

    //agar mera user uski id ke barabar nhi hai toh  --- koi doosra user login nhi kr sake isliye not allowed
    if (note.user.toString() !== req.userDetails.id) {
      return res.status(401).send("not allowed");
    }

    //new true ka mtlb hai ki agar naya contact ata hai toh update ho hjayega
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ success: "your note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;
