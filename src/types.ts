export interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
  favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface NoteCreate {
  title: string;
  content: string;
  tags: string[];
  favorite: boolean;
}

export interface NoteUpdate {
  title?: string;
  content?: string;
  tags?: string[];
  favorite?: boolean;
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}
