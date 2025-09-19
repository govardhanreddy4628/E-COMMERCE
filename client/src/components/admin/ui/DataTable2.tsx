import React from "react";

export interface Column<T> {
  key: string;
  header: string | JSX.Element;
  className?: string;
  render: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
}

export function Table<T extends { id: number | string }>({
  data,
  columns,
  emptyMessage = "No records found.",
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto border rounded dark:border-gray-700 max-h-[60vh] overflow-y-auto">
      <table className="min-w-full bg-white dark:bg-gray-900 text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={`px-4 py-2 ${col.className ?? ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((row) => (
              <tr
                key={row.id}
                className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-2 ${col.className ?? ""}`}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-4 text-gray-500 dark:text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
