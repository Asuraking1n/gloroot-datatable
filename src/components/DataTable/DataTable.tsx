import React, { useState, useEffect } from "react";
import { Post } from "../../../src/types/data";
import { useDataTable } from "../../../src/hooks/useDataTable";
import {
  ChevronUp,
  ChevronDown,
  Search,
  Pencil,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useDebounce } from "../../../src/hooks/useDebounce";

interface DataTableProps {
  onEdit?: (post: Post) => void;
  onDelete?: (id: number) => void;
  refetchTrigger?: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({
  onEdit,
  onDelete,
  refetchTrigger,
}) => {
  const {
    data,
    total,
    loading,
    error,
    tableState,
    handlePageChange,
    handleSortChange,
    handleSearchChange,
    handleColumnVisibilityChange,
    fetchData,
  } = useDataTable();


  useEffect(() => {
    fetchData();
  }, [refetchTrigger, fetchData]);

  const [selectedColumns, setSelectedColumns] = useState(
    tableState.visibleColumns
  );

  const [searchTerm, setSearchTerm] = useState(tableState.search);
  const debouncedHandleSearch = useDebounce((value: string) => {
    handleSearchChange(value);
  }, 1000);

  const toggleColumn = (column: string) => {
    const newColumns = selectedColumns.includes(column)
      ? selectedColumns.filter((col) => col !== column)
      : [...selectedColumns, column];
    setSelectedColumns(newColumns);
    handleColumnVisibilityChange(newColumns);
  };

  if (error) {
    return (
      <div className="rounded bg-red-900/20 p-4 text-red-400">
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const columns = [
    { key: "title", label: "Title" },
    { key: "author", label: "Author" },
    { key: "body", label: "Content" },
    { key: "lastUpdated", label: "Last Updated" },
  ];

  return (
    <div className="space-y-4">
      {/* Search and Column Toggle */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-4 pr-10 py-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-gray-600 focus:border-gray-600 w-full md:w-64 text-gray-100 placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debouncedHandleSearch(e.target.value);
            }}
          />
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <span className="text-sm text-gray-400">Show columns:</span>
          {columns.map((column) => (
            <label key={column.key} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={selectedColumns.includes(column.key)}
                onChange={() => toggleColumn(column.key)}
                className="form-checkbox h-4 w-4 text-gray-600 rounded border-gray-600 bg-gray-700 focus:ring-offset-gray-900"
              />
              <span className="ml-2 text-sm text-gray-300">{column.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded border border-gray-800">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-gray-800">
            <tr>
              {columns
                .filter((col) => selectedColumns.includes(col.key))
                .map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-700 transition-colors"
                    onClick={() => handleSortChange(column.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.label}</span>
                      {tableState.sortBy === column.key &&
                        (tableState.sortOrder === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        ))}
                    </div>
                  </th>
                ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-800">
            {loading ? (
              <tr>
                <td
                  colSpan={selectedColumns.length + 1}
                  className="px-6 py-4 text-center text-sm text-gray-400"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 size={16} className="animate-spin text-gray-400" />
                    <span>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((post) => (
                <tr key={post.id} className="hover:bg-gray-800/50">
                  {columns
                    .filter((col) => selectedColumns.includes(col.key))
                    .map((column) => (
                      <td
                        key={column.key}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 max-w-72 truncate"
                      >
                        {column.key === "lastUpdated"
                          ? new Date(post[column.key]).toLocaleString()
                          : post[column.key as keyof Post]}
                      </td>
                    ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit?.(post)}
                      className="text-gray-400 hover:text-gray-100 mr-4 transition-colors inline-flex items-center"
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete?.(post.id)}
                      className="text-red-400 hover:text-red-300 transition-colors inline-flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <div>
          <p>
            Showing{" "}
            <span className="font-medium text-gray-200">
              {(tableState.page - 1) * tableState.pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-gray-200">
              {Math.min(tableState.page * tableState.pageSize, total)}
            </span>{" "}
            of <span className="font-medium text-gray-200">{total}</span>{" "}
            results
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(tableState.page - 1)}
            disabled={tableState.page === 1}
            className="inline-flex items-center px-3 py-1 border border-gray-700 rounded text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous
          </button>
          <button
            onClick={() => handlePageChange(tableState.page + 1)}
            disabled={tableState.page * tableState.pageSize >= total}
            className="inline-flex items-center px-3 py-1 border border-gray-700 rounded text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
