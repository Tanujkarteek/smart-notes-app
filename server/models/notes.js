// server/models/Note.js
const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      trim: true,
      default: "Untitled Note",
    },
    content: {
      type: String,
      required: [true, "Please provide note content"],
    },
    summary: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create compound text index for search
NoteSchema.index({
  title: "text",
  content: "text",
  tags: "text",
});

module.exports = mongoose.model("Note", NoteSchema);
