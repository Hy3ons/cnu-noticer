export interface AttachmentFile {
  id: number;
  filename: string;
  url: string;
}

export interface AttachmentImage {
  id: number;
  url: string;
}

export interface Announcement {
  id: number;
  title: string;
  ai_summary_title: string | null;
  ai_summary_content: string | null;
  markdown_content: string;
  writer: string;
  created_at: string;
  publish_date: string;
  category: number | null;
  original_url: string;
  images: AttachmentImage[];
  files: AttachmentFile[];
}

export const categoryMapping: { [key: number]: { name: string; color: string } } = {
  0: { name: '학사', color: 'blue' },
  1: { name: '교내', color: 'green' },
  2: { name: '사업단', color: 'orange' },
  3: { name: '학부News', color: 'purple' },
}; 