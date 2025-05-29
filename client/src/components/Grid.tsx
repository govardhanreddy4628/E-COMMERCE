import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams, GridRenderCellParams } from '@mui/x-data-grid';
import { Box } from '@mui/material';

// Define the structure of a row using TypeScript interfaces
interface RowData {
  id: number;
  firstName: string;
  lastName: string;
  birthYear: number;
}

// Sample data for the grid
const rows: RowData[] = [
  { id: 1, firstName: 'John', lastName: 'Doe', birthYear: 1990 },
  { id: 2, firstName: 'Jane', lastName: 'Smith', birthYear: 1985 },
  { id: 3, firstName: 'Tom', lastName: 'Johnson', birthYear: 2000 },
];

// Define the columns with the appropriate types
const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'fullName',
    headerName: 'Full Name',
    width: 180,
    valueGetter: (value, row) => {console.log(` ${row.firstName}`); return `${row.lastName}`} 
  },
  {
    field: 'birthYear',
    headerName: 'Birth Year',
    width: 130,
    renderCell: (params: GridRenderCellParams) => {
      const currentYear = new Date().getFullYear();
      const age = currentYear - (params.value as number); // Cast to number since birthYear is of type number
      return <strong>{age}</strong>;
    },
  },
];

const GridMui: React.FC = () => {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} />
    </Box>
  );
};

export default GridMui;
