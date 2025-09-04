import React, { useState, useMemo } from "react";
import Pagination from "./Pagination";
import Actions from "../customers/Actions";


export interface Column<T> {
  label: string;
  accessor: keyof T | string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  rowsPerPageOptions?: number[];
  defaultRowsPerPage?: number;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  bulkActions?: React.ReactNode;
  searchTerm?: string;
  onSearch?: (term: string) => void;
}

function DataTable<T>({
  columns,
  data,
  keyField,
  rowsPerPageOptions = [5, 10, 20, -1],
  defaultRowsPerPage = 5,
  onView,
  onEdit,
  onDelete,
  bulkActions,
}: DataTableProps<T>) {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [selected, setSelected] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortField) return [...data];
    return [...data].sort((a, b) => {
      const aVal = (a as any)[sortField];
      const bVal = (b as any)[sortField];
      return sortAsc ? aVal - bVal : bVal - aVal;
    });
  }, [data, sortField, sortAsc]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (rowsPerPage === -1) return sortedData;
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, rowsPerPage, currentPage]);

  const totalPages = rowsPerPage === -1 ? 1 : Math.ceil(sortedData.length / rowsPerPage);

  const toggleSort = (accessor: string) => {
    if (sortField === accessor) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(accessor);
      setSortAsc(true);
    }
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelected(checked ? paginatedData.map(row => (row as any)[keyField]) : []);
  };

  const toggleSelectRow = (id: any) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        {bulkActions}
        <div>
          <label>Rows per page: </label>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              const val = e.target.value === "all" ? -1 : parseInt(e.target.value);
              setRowsPerPage(val);
              setCurrentPage(1);
            }}
          >
            {rowsPerPageOptions.map((opt) =>
              opt === -1 ? (
                <option key="all" value="all">All</option>
              ) : (
                <option key={opt} value={opt}>{opt}</option>
              )
            )}
          </select>
        </div>
      </div>

      <table className="min-w-full border">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={paginatedData.length > 0 && selected.length === paginatedData.length}
                onChange={(e) => toggleSelectAll(e.target.checked)}
              />
            </th>
            {columns.map((col) => (
              <th
                key={col.accessor.toString()}
                onClick={() => col.sortable && toggleSort(col.accessor.toString())}
                className={col.sortable ? "cursor-pointer" : ""}
              >
                {col.label} {sortField === col.accessor ? (sortAsc ? "↑" : "↓") : ""}
              </th>
            ))}
            {(onView || onEdit || onDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row) => {
            const id = (row as any)[keyField];
            return (
              <tr key={id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(id)}
                    onChange={() => toggleSelectRow(id)}
                  />
                </td>
                {columns.map((col) => (
                  <td key={col.accessor.toString()}>
                    {col.render ? col.render(row) : (row as any)[col.accessor]}
                  </td>
                ))}
                <td className="px-4 py-2 text-center space-x-3 flex items-center">
                  <Actions cust={cust} setActionType={setActionType} setSelectedCustomer={setSelectedCustomer} setShowModal={setShowModal} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {rowsPerPage !== -1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

export default DataTable;
