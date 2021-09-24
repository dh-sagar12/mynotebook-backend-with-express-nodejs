const express = require('express');
const fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');
const Note = require('../models/Notes');
const User = require('../models/User');

const router = express.Router();


// ROUTE 1: fetch all the notes of the particular user: LOGIN REQUIRED
router.get('/fetchnotes/', fetchuser, async (req, res) => {
   const notes = await Note.find({ user: req.user.id })
   res.json(notes)
})

router.post('/createnote/', fetchuser,
   [
      // validating email name and password 
      body('title', "Title Must Have Atleast 3 Characters").isLength({ min: 3 }),
      body('description', "Decription must be atleast Five Characters long").isLength({ min: 5 })
   ], async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }
      const { title, description, tag } = req.body
      try {
         const note = new Note({
            title, description, tag, user: req.user.id
         })
         const savedNote = await note.save();
         res.json(savedNote)
      } catch (error) {
         res.status(500).send('Internal Server Error')

      }
    

   }
)

router.put('/updatenotes/:id', fetchuser, [
   // validating email name and password 
   body('title', "Title Must Have Atleast 3 Characters").isLength({ min: 3 }),
   body('description', "Decription must be atleast Five Characters long").isLength({ min: 5 })
], async (req, res) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }
   const { title, description, tag } = req.body;
   let newNote = {}
   if (title) {
      newNote.title = title
   }
   if (description) {
      newNote.description = description
   }
   if (tag) {
      newNote.tag = tag
   }

   //find the note to be updated and upadate it 
   let note = await Note.findById(req.params.id);
   console.log(note.user.toString())
   if (!note) {
      return res.status(400).send('Not Found')
   }
   if (note.user.toString() !== req.user.id) {
      return res.status(403).send("Forbidden")
   }

   note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true }) 
   res.json(note)

})

// ROUTE 3: Delete note route: login required and method is delete 
router.delete('/deletenote/:id/', fetchuser, async (req, res)=>{
   // find the note to be deleted and delete it 
   let note = await Note.findById(req.params.id)
   if (!note){
      return res.status(400).send('Note Found')
   }

   if (note.user.toString() !== req.user.id){
      return res.status(403).send("Forbidden")
   }

   note = await Note.findByIdAndDelete(req.params.id)
   res.json({"success": "Note Has Been Deleted Successfully", note: note})
})
module.exports = router