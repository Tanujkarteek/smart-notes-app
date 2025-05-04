import api from "../utils/api";

export interface Note {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NoteFormData {
  title: string;
  content: string;
  tags: string[];
}

export interface GetNotesResponse {
  notes: Note[];
  totalPages: number;
}

// Get all notes with pagination and search
export const getAllNotes = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  searchBy: "content" | "tags" = "content"
): Promise<GetNotesResponse> => {
  const response = await api.get<GetNotesResponse>("/api/notes", {
    params: { page, limit, search, searchBy },
  });
  return response.data;
};

// Get a single note by ID
export const getNote = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/api/notes/${id}`);
  return response.data;
};

// Create a new note
export const createNote = async (noteData: NoteFormData): Promise<Note> => {
  const response = await api.post<Note>("/api/notes", noteData);
  return response.data;
};

// Update a note
export const updateNote = async (
  id: string,
  noteData: NoteFormData
): Promise<Note> => {
  const response = await api.put<Note>(`/api/notes/${id}`, noteData);
  return response.data;
};

// Delete a note
export const deleteNote = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/api/notes/${id}`);
  return response.data;
};

// Get a summary of a note
export const getNoteSummary = async (id: string): Promise<string> => {
  const response = await api.get<{ summary: string }>(
    `/api/notes/${id}/summary`
  );
  return response.data.summary;
};

// get suggested tags for a note
export const getSuggestedTags = async (content: string): Promise<string[]> => {
  // create a get function
  const response = await api.get<any>("/api/notes/tags", {
    params: { content },
  });
  return response.data;
};
