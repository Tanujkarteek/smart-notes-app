// server/routes/noteRoutes.js
const express = require("express");
const router = express.Router();
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} = require("../controller/noteController");
const { suggestTags } = require("../services/aiService");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected - require authentication
router.use(protect);

// Get all notes / create a note
router.route("/").get(getNotes).post(createNote);

// get notes tag suggestions
router.get("/tags", async (req, res) => {
  try {
    const tags = await suggestTags(req.query.content);
    if (!tags) {
      return res.status(404).json({ message: "No tags found" });
    }
    res.status(200).json(tags);
  } catch (error) {
    console.error("Get tags error:", error);
    res.status(500).json({ message: "Server error getting tags" });
  }
});

// Get, update, delete specific note by ID
router.route("/:id").get(getNote).put(updateNote).delete(deleteNote);

module.exports = router;
