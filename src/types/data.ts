export interface Post {
  id: number;
  title: string;
  author: string;
  body: string;
  lastUpdated: string;
}

export interface TableState {
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  search: string;
  visibleColumns: string[];
}

export interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  message: string;
  status: number;
}
