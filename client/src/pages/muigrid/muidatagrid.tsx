import React from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import Pagination from "./pagination";

// Types for the data row
interface DataRow {
  id: number;
  name: string;
}

// MuiDataGridProps defines the types for the props in the data grid
interface MuiDataGridProps {
  rows: DataRow[];
  columns: GridColDef[];
  checkboxSelection?: boolean;
  headerBackgroundColor?: string;
  noPadding?: boolean;
  resetPage?: boolean;
  handleSelectionChange?: (newSelection: GridRowId[]) => void;
  isRowSelectable?: (params: any) => boolean;
}

const MuiDataGrid: React.FC<MuiDataGridProps> = ({
  rows,
  columns,
  checkboxSelection = false,
  headerBackgroundColor = "transparent",
  noPadding = false,
  resetPage = false,
  handleSelectionChange,
  isRowSelectable,
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  // When resetPage is true, reset the page to 1
  React.useEffect(() => {
    if (resetPage) {
      setCurrentPage(1);
    }
  }, [resetPage]);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handlePreviousPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  const handleNextPage = () => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, rows.length);
  const visibleRows = rows.slice(startIndex, endIndex);

  return (
    <Box sx={{ width: "100%", border: "1px solid #EAECF0", borderRadius: 1.5, padding: noPadding ? 0 : 2 }}>
      {visibleRows.length === 0 ? (
        <Box>
          <Typography variant="h6" color="textSecondary">
            No data found
          </Typography>
        </Box>
      ) : (
        <>
          <DataGrid
            rows={visibleRows}
            columns={columns}
            checkboxSelection={checkboxSelection}
            disableRowSelectionOnClick
            disableColumnMenu
            className="data-grid"
            isRowSelectable={isRowSelectable}
            onSelectionModelChange={handleSelectionChange}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
          />
        </>
      )}
    </Box>
  );
};

export default MuiDataGrid;
