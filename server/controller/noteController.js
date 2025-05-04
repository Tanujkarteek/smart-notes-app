const Note = require("../models/note");
const { generateSummary, suggestTags } = require("../services/aiService");

// Helper function to strip HTML tags
const stripHtmlTags = (html) => {
  return html.replace(/<[^>]*>/g, "");
};

// Get all notes for a user
exports.getNotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const searchBy = req.query.searchBy || "";

    let query = { user: req.user._id };

    // Add search conditions based on searchBy parameter
    if (search) {
      if (searchBy === "tags") {
        query.tags = { $regex: search, $options: "i" };
      }
      if (searchBy === "content") {
        query.content = { $regex: search, $options: "i" };
      } else {
        // Default search in title and content
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ];
      }
    }

    const [notes, total] = await Promise.all([
      Note.find(query).skip(skip).limit(limit),
      Note.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      notes,
      totalPages,
    });
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({ message: "Server error getting notes" });
  }
};

// Get a single note
exports.getNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Get note error:", error);
    res.status(500).json({ message: "Server error getting note" });
  }
};

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const plainTextContent = stripHtmlTags(content);

    // create a summary of the body
    let summary = plainTextContent.split(" ").slice(0, 20).join(" ") + "...";
    if (plainTextContent.length > 40) {
      summary = await generateSummary(summary);
    } else {
      summary = "";
    }
    // const tags = await suggestTags(content);

    const note = await Note.create({
      title,
      content,
      tags,
      summary,
      user: req.user._id,
    });

    res.status(201).json(note);
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({ message: "Server error creating note" });
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const plainTextContent = stripHtmlTags(content);

    // create a summary of the body
    let summary = plainTextContent.split(" ").slice(0, 20).join(" ") + "...";
    if (plainTextContent.length > 40) {
      summary = await generateSummary(summary);
    } else {
      summary = "";
    }
    // const tags = await suggestTags(content);

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, content, tags, summary },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({ message: "Server error updating note" });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ message: "Server error deleting note" });
  }
};
