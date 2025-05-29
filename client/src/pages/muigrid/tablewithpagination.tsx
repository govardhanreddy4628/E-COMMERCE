import React from "react";
import MuiDataGrid from "./muidatagrid";
import { Box, Grid } from "@mui/material";

const mockRows = Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    name: `User ${index + 1}`,
  }));
const Tablewithpagination : React.FC = () => {
    const columns = [
        { field: "id", headerName: "ID", width: 100 },
        { field: "name", headerName: "Name", width: 200 },
      ];
  return (
      <Grid container md={6}>
    <Box sx={{ padding:1}}>
      <h1>React DataGrid with Pagination</h1>
      <MuiDataGrid
        rows={mockRows}
        columns={columns}
        checkboxSelection={false}
        headerBackgroundColor="transparent"
      />
      
    </Box>
      </Grid>
  )
}

export default Tablewithpagination
