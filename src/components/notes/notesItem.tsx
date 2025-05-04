import React from "react";
import { Link } from "react-router-dom";

interface Note {
  _id: string;
  title?: string;
  content: string;
  summary?: string;
  tags?: string[];
  updatedAt: string;
}

interface NoteItemProps {
  note: Note;
}

const NoteItem: React.FC<NoteItemProps> = ({ note }) => {
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const truncateContent = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
      <Link to={`/notes/${note._id}`} className="block">
        <h3 className="text-lg font-semibold mb-2 text-indigo-700">
          {note.title || "Untitled Note"}
        </h3>

        {note.summary && note.summary != note.content && (
          <div className="bg-gray-50 p-2 mb-3 text-sm text-gray-600 rounded">
            {note.summary}
          </div>
        )}

        {note.summary == "" && (
          <div className="bg-gray-50 p-2 mb-3 text-sm text-gray-600 rounded">
            <p
              className="text-gray-600 mb-4"
              dangerouslySetInnerHTML={{
                __html: truncateContent(note.content),
              }}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags?.map((tag, index) => (
            <span
              key={index}
              className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="text-xs text-gray-500">
          Last updated: {formatDate(note.updatedAt)}
        </div>
      </Link>
    </div>
  );
};

export default NoteItem;
