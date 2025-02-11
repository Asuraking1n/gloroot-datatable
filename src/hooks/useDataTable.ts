import { useState, useCallback, useEffect } from "react";
import { Post, TableState, ApiResponse } from "../types/data";
import { getPosts, createPost, updatePost, deletePost } from "../services/api";

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_VISIBLE_COLUMNS = ["title", "author", "lastUpdated"];

export const useDataTable = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);

  const [tableState, setTableState] = useState<TableState>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: "lastUpdated",
    sortOrder: "desc",
    search: "",
    visibleColumns: DEFAULT_VISIBLE_COLUMNS,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse<Post> = await getPosts(tableState);
      setData(response.data);
      setTotal(response.total);
    } catch (err) {
      console.log(err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [tableState]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (page: number) => {
    setTableState((prev) => ({ ...prev, page }));
  };

  const handleSortChange = (sortBy: string) => {
    setTableState((prev) => ({
      ...prev,
      sortBy,
      sortOrder:
        prev.sortBy === sortBy && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const handleSearchChange = (search: string) => {
    setTableState((prev) => ({ ...prev, search, page: 1 }));
  };

  const handleColumnVisibilityChange = (columns: string[]) => {
    setTableState((prev) => ({ ...prev, visibleColumns: columns }));
  };

  const handleCreatePost = async (post: Omit<Post, "id" | "lastUpdated">) => {
    try {
      await createPost(post);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleUpdatePost = async (id: number, post: Partial<Post>) => {
    try {
      await updatePost(id, post);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleDeletePost = async (id: number) => {
    try {
      await deletePost(id);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return {
    data,
    total,
    loading,
    error,
    tableState,
    fetchData,
    handlePageChange,
    handleSortChange,
    handleSearchChange,
    handleColumnVisibilityChange,
    handleCreatePost,
    handleUpdatePost,
    handleDeletePost,
  };
};
