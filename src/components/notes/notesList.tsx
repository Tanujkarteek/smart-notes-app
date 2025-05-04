import React, { useState, useEffect, KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { getAllNotes } from "../../services/noteService";
import NoteItem from "./notesItem";

interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const NoteList: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchBy, setSearchBy] = useState<"content" | "tags">("content");

  const fetchNotes = async (
    page: number,
    search: string = "",
    searchType: "content" | "tags" = "content"
  ): Promise<void> => {
    try {
      setLoading(true);
      const response = await getAllNotes(page, 10, search, searchType);
      setNotes(response.notes);
      setTotalPages(response.totalPages);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch notes");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes(currentPage, searchTerm, searchBy);
  }, [currentPage]);

  const handleSearch = (): void => {
    setCurrentPage(1); // Reset to first page when searching
    fetchNotes(1, searchTerm, searchBy);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Notes</h1>
        <Link
          to="/notes/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
        >
          Create New Note
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value as "content" | "tags")}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="content">By Content</option>
            <option value="tags">By Tags</option>
          </select>
          <button
            onClick={handleSearch}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          >
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading notes...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : notes?.length === 0 ? (
        <div className="text-center py-4">
          No notes found.{" "}
          {searchTerm
            ? "Try a different search term."
            : "Create your first note!"}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes?.map((note) => (
              <NoteItem key={note._id} note={note} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <nav className="flex items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-l ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Previous
              </button>
              <div className="px-4 py-1 bg-white">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-r ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        </>
      )}
    </div>
  );
};

export default NoteList;
