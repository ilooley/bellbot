"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from "lucide-react";

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (info: { row: T; value: any }) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pagination?: boolean;
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loading?: boolean;
  onRowClick?: (row: T) => void;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  dense?: boolean;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  pagination = true,
  pageSize = 10,
  searchable = true,
  searchPlaceholder = "Search...",
  emptyMessage = "No data available",
  loading = false,
  onRowClick,
  striped = true,
  hoverable = true,
  bordered = false,
  dense = false,
  className = "",
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");

  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  // Handle sorting
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  // Helper function to get nested property value
  const getNestedValue = (obj: any, path: string) => {
    const keys = path.split(".");
    return keys.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
  };

  // Filter and sort data
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply search filter if searchable and query exists
    if (searchable && searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter((row) => {
        return columns.some((column) => {
          const value = getNestedValue(row, column.accessorKey as string);
          return value !== null && String(value).toLowerCase().includes(lowerCaseQuery);
        });
      });
    }

    // Apply sorting if a sort column is selected
    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = getNestedValue(a, sortColumn);
        const bValue = getNestedValue(b, sortColumn);

        if (aValue === bValue) return 0;
        
        // Handle null/undefined values
        if (aValue === null || aValue === undefined) return sortDirection === "asc" ? -1 : 1;
        if (bValue === null || bValue === undefined) return sortDirection === "asc" ? 1 : -1;

        // Compare based on type
        if (typeof aValue === "string") {
          return sortDirection === "asc" 
            ? aValue.localeCompare(String(bValue)) 
            : String(bValue).localeCompare(aValue);
        }
        
        return sortDirection === "asc" 
          ? (aValue > bValue ? 1 : -1) 
          : (aValue > bValue ? -1 : 1);
      });
    }

    return result;
  }, [data, columns, searchQuery, sortColumn, sortDirection]);

  // Pagination
  const totalPages = pagination ? Math.ceil(processedData.length / pageSize) : 1;
  const paginatedData = pagination 
    ? processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize) 
    : processedData;

  // Table style classes
  const tableClasses = [
    "w-full text-sm text-left text-gray-700 dark:text-gray-300",
    bordered ? "border border-gray-200 dark:border-gray-700" : "",
    className
  ].join(" ");

  const thClasses = [
    "px-4 py-3 font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800",
    bordered ? "border border-gray-200 dark:border-gray-700" : "",
  ].join(" ");

  const tdClasses = [
    `px-4 ${dense ? "py-2" : "py-3"}`,
    bordered ? "border border-gray-200 dark:border-gray-700" : "",
  ].join(" ");

  const trClasses = [
    hoverable ? "hover:bg-gray-50 dark:hover:bg-gray-800/50" : "",
    onRowClick ? "cursor-pointer" : "",
  ].join(" ");

  return (
    <div className="w-full">
      {/* Search input */}
      {searchable && (
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* Table */}
      <div className="relative overflow-x-auto rounded-lg shadow-sm">
        <table className={tableClasses}>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`${thClasses} ${column.className || ""}`}
                  onClick={() => column.sortable && handleSort(column.accessorKey as string)}
                  style={{ cursor: column.sortable ? "pointer" : "default" }}
                >
                  <div className="flex items-center justify-between">
                    {column.header}
                    {column.sortable && sortColumn === column.accessorKey && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  <div className="flex justify-center items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                    <span>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`${trClasses} ${striped && rowIndex % 2 === 1 ? "bg-gray-50 dark:bg-gray-800/50" : ""}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className={`${tdClasses} ${column.className || ""}`}>
                      {column.cell
                        ? column.cell({ row, value: getNestedValue(row, column.accessorKey as string) })
                        : getNestedValue(row, column.accessorKey as string)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {Math.min((currentPage - 1) * pageSize + 1, processedData.length)} to{" "}
            {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length} entries
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="First page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 border rounded-md ${
                    currentPage === pageNum
                      ? "bg-primary-600 text-white border-primary-600"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Last page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
