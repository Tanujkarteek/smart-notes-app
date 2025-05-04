require("dotenv").config();
const { pipeline } = require("@xenova/transformers");

// Initialize models
let summarizer, tagger;

(async () => {
  try {
    // Initialize the summarization model with a public model
    summarizer = await pipeline("summarization", "Xenova/distilbart-cnn-12-6", {
      cache_dir: "./models",
    });

    // Initialize the tagging model with a public model
    tagger = await pipeline(
      "text-classification",
      "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
      {
        cache_dir: "./models",
      }
    );

    console.log("Models loaded successfully");
  } catch (error) {
    console.error("Error loading models:", error);
  }
})();

// Generate a summary of the note content
exports.generateSummary = async (content) => {
  try {
    if (!summarizer) {
      console.warn("Summarizer model not loaded yet.");
      return generateFallbackSummary(content);
    }

    const result = await summarizer(content.substring(0, 1000), {
      max_length: 60,
      min_length: 15,
    });
    return result[0]?.summary_text?.trim() || generateFallbackSummary(content);
  } catch (error) {
    console.error("Error generating summary:", error);
    return generateFallbackSummary(content);
  }
};

// Simple fallback if model isn't ready
const generateFallbackSummary = (content) => {
  const firstSentenceMatch = content.match(/^.*?[.!?](?:\s|$)/);
  if (firstSentenceMatch && firstSentenceMatch[0].length < 120) {
    return firstSentenceMatch[0].trim();
  } else {
    return content.substring(0, 100).trim() + "...";
  }
};

// Suggest tags using the sentiment model
exports.suggestTags = async (content) => {
  try {
    if (!summarizer) {
      console.warn("Summarizer model not loaded yet.");
      return [];
    }

    // Generate a summary to focus on key content
    const result = await summarizer(content.substring(0, 1000), {
      max_length: 60,
      min_length: 15,
    });

    const summary = result[0]?.summary_text || "";

    // Extract words, remove common stopwords, and pick top 3 unique keywords
    const stopwords = new Set([
      "the",
      "is",
      "in",
      "at",
      "which",
      "on",
      "a",
      "an",
      "and",
      "of",
      "to",
      "with",
      "as",
      "for",
      "by",
      "this",
      "that",
      "from",
    ]);

    const wordCounts = {};
    summary
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .forEach((word) => {
        if (!stopwords.has(word) && word.length > 2) {
          wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
      });

    // Sort by frequency and return top 3 keywords
    const sortedKeywords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([word]) => word);

    return sortedKeywords.slice(0, 3);
  } catch (error) {
    console.error("Error suggesting tags:", error);
    return [];
  }
};
