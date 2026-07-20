export interface SearchDetailResponse {
  type: SearchDetailType;
  id: string;
  title: string;
  subtitle: string;
  summary: SearchDetailSummary;
  links: SearchDetailLink[];
  data: any;
}

export type SearchDetailType =
  | 'todoItem'
  | 'user'
  | 'attachment'
  | 'dependency'
  | 'todoSubItem';

export interface SearchDetailSummary {
  status?: string;
  createdOn?: string;
  updatedOn?: string;
}

export interface SearchDetailLink {
  type: SearchDetailType;
  id: string;
  description: string;
}
