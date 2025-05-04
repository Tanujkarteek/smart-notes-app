import React, {
  useState,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
  FormEvent,
  useCallback,
  useRef,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getNote,
  createNote,
  updateNote,
  deleteNote,
  getSuggestedTags,
} from "../../services/noteService";
import debounce from "lodash/debounce";
import { capitalize } from "lodash";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";

interface NoteFormData {
  title: string;
  content: string;
  tags: string[];
}

type RouteParams = Record<string, string | undefined>;

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 mb-2 p-1 border-b border-gray-200">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1 rounded hover:bg-gray-200 ${
          editor.isActive("bold") ? "bg-gray-200" : ""
        }`}
        title="Bold"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
          <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
        </svg>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1 rounded hover:bg-gray-200 ${
          editor.isActive("italic") ? "bg-gray-200" : ""
        }`}
        title="Italic"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="19" y1="4" x2="10" y2="4"></line>
          <line x1="14" y1="20" x2="5" y2="20"></line>
          <line x1="15" y1="4" x2="9" y2="20"></line>
        </svg>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-1 rounded hover:bg-gray-200 ${
          editor.isActive("strike") ? "bg-gray-200" : ""
        }`}
        title="Strike"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M17.3 4.9c-2.3-.6-4.4-1-6.2-.9-2.7.1-5.3.9-5.3 3.7 0 1.3.6 2.3 1.8 3.2" />
          <path d="M12.2 19.1c2.3.2 4.8-.5 4.8-3.7 0-1.3-.5-2.2-1.5-2.9" />
          <line x1="3" y1="12" x2="21" y2="12" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-1 rounded hover:bg-gray-200 ${
          editor.isActive("code") ? "bg-gray-200" : ""
        }`}
        title="Code"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1 rounded hover:bg-gray-200 ${
          editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
        }`}
        title="Heading 1"
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1 rounded hover:bg-gray-200 ${
          editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
        }`}
        title="Heading 2"
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-1 rounded hover:bg-gray-200 ${
          editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""
        }`}
        title="Heading 3"
      >
        H3
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1 rounded hover:bg-gray-200 ${
          editor.isActive("bulletList") ? "bg-gray-200" : ""
        }`}
        title="Bullet List"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1 rounded hover:bg-gray-200 ${
          editor.isActive("orderedList") ? "bg-gray-200" : ""
        }`}
        title="Ordered List"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="10" y1="6" x2="21" y2="6"></line>
          <line x1="10" y1="12" x2="21" y2="12"></line>
          <line x1="10" y1="18" x2="21" y2="18"></line>
          <path d="M4 6h1v4"></path>
          <path d="M4 10h2"></path>
          <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
        </svg>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={`p-1 rounded hover:bg-gray-200 ${
          editor.isActive("taskList") ? "bg-gray-200" : ""
        }`}
        title="Task List"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="5" width="6" height="6" rx="1"></rect>
          <path d="M3 17h6"></path>
          <path d="M13 6h8"></path>
          <path d="M13 12h8"></path>
          <path d="M13 18h8"></path>
        </svg>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1 rounded hover:bg-gray-200 ${
          editor.isActive("blockquote") ? "bg-gray-200" : ""
        }`}
        title="Quote"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`p-1 rounded hover:bg-gray-200 ${
          editor.isActive("highlight") ? "bg-gray-200" : ""
        }`}
        title="Highlight"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="9" y="2" width="6" height="6"></rect>
          <rect x="4" y="8" width="16" height="12" rx="2"></rect>
          <path d="M12 8v12"></path>
        </svg>
      </button>
      <button
        type="button"
        onClick={() => {
          const url = window.prompt("Enter image URL:");
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
        className="p-1 rounded hover:bg-gray-200"
        title="Insert Image"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      </button>
      <button
        type="button"
        onClick={() => {
          const url = window.prompt("Enter link URL:");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`p-1 rounded hover:bg-gray-200 ${
          editor.isActive("link") ? "bg-gray-200" : ""
        }`}
        title="Insert Link"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().unsetLink().run()}
        className="p-1 rounded hover:bg-gray-200"
        title="Remove Link"
        disabled={!editor.isActive("link")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className="p-1 rounded hover:bg-gray-200"
        title="Undo"
        disabled={!editor.can().undo()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 10h10a8 8 0 0 1 8 8v2M3 10l6 6M3 10l6-6"></path>
        </svg>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        className="p-1 rounded hover:bg-gray-200"
        title="Redo"
        disabled={!editor.can().redo()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 10H11a8 8 0 0 0-8 8v2M21 10l-6 6M21 10l-6-6"></path>
        </svg>
      </button>
    </div>
  );
};

const NoteEditor: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<NoteFormData>({
    title: "",
    content: "",
    tags: [],
  });

  const [tagInput, setTagInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(isEditMode);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] =
    useState<boolean>(false);
  const editorContentRef = useRef<string>("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write your note here...",
      }),
      Highlight,
      Typography,
      Link.configure({
        openOnClick: false,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image,
    ],
    content: formData.content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      editorContentRef.current = html;

      // Update formData with new content
      setFormData((prev) => ({
        ...prev,
        content: html,
      }));

      // Trigger tag suggestions based on new content
      const text = editor.getText();
      fetchSuggestedTags(text);
    },
  });

  useEffect(() => {
    if (isEditMode && id) {
      const fetchNote = async () => {
        try {
          const noteData = await getNote(id);
          const noteContent = noteData.content || "";

          setFormData({
            title: noteData.title || "",
            content: noteContent,
            tags: noteData.tags || [],
          });

          // Update editor content once we have it
          if (editor && noteContent) {
            editor.commands.setContent(noteContent);
          }

          setLoading(false);
        } catch (err: any) {
          setError("Failed to load note. Please try again.");
          setLoading(false);
        }
      };

      fetchNote();
    }
  }, [id, isEditMode, editor]);

  const fetchSuggestedTags = useCallback(
    debounce(async (content: string) => {
      if (!content.trim()) {
        setSuggestedTags([]);
        return;
      }
      setIsLoadingSuggestions(true);
      try {
        const tags = await getSuggestedTags(content);
        setSuggestedTags(tags);
      } catch (err) {
        console.error("Failed to fetch suggested tags:", err);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 1000),
    []
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTagInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, trimmedTag],
      });
      setTagInput("");
    }
  };

  const handleTagInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    // Ensure we have the latest content from the editor
    const formDataToSubmit = {
      ...formData,
      content: editorContentRef.current || formData.content,
    };

    try {
      if (isEditMode && id) {
        await updateNote(id, formDataToSubmit);
      } else {
        await createNote(formDataToSubmit);
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to save note. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(id);
        navigate("/dashboard");
      } catch (err: any) {
        setError("Failed to delete note. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Loading note...
      </div>
    );
  }

  return (
    <>
      {saving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-700">
              AI is summarizing your note...
            </p>
          </div>
        </div>
      )}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {isEditMode ? "Edit Note" : "Create New Note"}
            </h1>
            <div className="flex space-x-8">
              {isEditMode && (
                <button
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              )}
              <button
                onClick={() => navigate("/dashboard")}
                className="text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-gray-700 font-medium mb-2"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Note Title"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="content"
                className="block text-gray-700 font-medium mb-2"
              >
                Content
              </label>
              <div className="w-full border border-gray-300 rounded focus-within:ring-2 focus-within:ring-indigo-500 overflow-hidden">
                <MenuBar editor={editor} />
                <div className="p-2 min-h-[300px]">
                  <EditorContent
                    editor={editor}
                    className="prose max-w-none outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-indigo-600 hover:text-indigo-800"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>

              {isLoadingSuggestions && (
                <div className="text-sm text-gray-500 mb-2">
                  Loading suggestions...
                </div>
              )}

              {suggestedTags.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm text-gray-500 mb-1">Suggested Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map((tag, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          if (!formData.tags.includes(tag)) {
                            setFormData({
                              ...formData,
                              tags: [...formData.tags, tag],
                            });
                          }
                        }}
                        className="bg-gray-100 text-gray-800 px-2 py-1 rounded hover:bg-gray-200"
                      >
                        {capitalize(tag)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex">
                <input
                  type="text"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagInputKeyDown}
                  className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Add a tag and press Enter"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-r"
                >
                  Add
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Press Enter or comma to add a tag
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {saving
                  ? "Saving..."
                  : isEditMode
                  ? "Update Note"
                  : "Create Note"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NoteEditor;
