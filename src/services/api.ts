import { Post, TableState, ApiResponse, ApiError } from "../types/data";

const API_BASE_URL = "http://localhost:3001";

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

interface RequestConfig extends RequestInit {
  method: RequestMethod;
  headers?: HeadersInit;
  body?: string;
}

async function apiRequest<T>(
  endpoint: string,
  { method, headers, body, ...customConfig }: Partial<RequestConfig> = {}
): Promise<T> {
  const config: RequestConfig = {
    method: method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body,
    ...customConfig,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw {
        message: data?.message || `HTTP error! status: ${response.status}`,
        status: response.status,
        data,
      } as ApiError;
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw {
        message: error.message,
        status: (error as any).status || 500,
        data: (error as any).data,
      } as ApiError;
    }
    throw {
      message: "An unexpected error occurred",
      status: 500,
    } as ApiError;
  }
}

export async function getPosts(
  tableState: TableState
): Promise<ApiResponse<Post>> {
  const { page, pageSize, sortBy, sortOrder, search } = tableState;
  const queryParams = new URLSearchParams({
    _page: String(page),
    _limit: String(pageSize),
    _sort: sortBy,
    _order: sortOrder,
    q: search,
  });

  const response = await fetch(`${API_BASE_URL}/posts?${queryParams}`);
  const data = await response.json();
  const total = Number(response.headers.get("X-Total-Count") || 0);

  return {
    data,
    total,
    page,
    pageSize,
  };
}

export async function createPost(
  post: Omit<Post, "id" | "lastUpdated">
): Promise<Post> {
  const postWithTimestamp = {
    ...post,
    lastUpdated: new Date().toISOString(),
  };

  return apiRequest<Post>("/posts", {
    method: "POST",
    body: JSON.stringify(postWithTimestamp),
  });
}

export async function updatePost(
  id: number,
  post: Partial<Post>
): Promise<Post> {
  const postWithTimestamp = {
    ...post,
    lastUpdated: new Date().toISOString(),
  };

  return apiRequest<Post>(`/posts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(postWithTimestamp),
  });
}

export async function deletePost(id: number): Promise<void> {
  await apiRequest(`/posts/${id}`, { method: "DELETE" });
}
