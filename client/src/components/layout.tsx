import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";
import { Box, Typography } from "@mui/material";
import Sidebar from "./sidebar";

const Layout = () => {
  

  return (
    <>
      <Navbar />
      <Box className="w-full adjust">
        <Typography>hello world</Typography>
        <main className="flex w-full bg-gray-500">
          <Sidebar/>
          <div className="flex-1">
            <Outlet />
          </div>
        </main>
      </Box>
      <Footer />
    </>
  );
};

export default Layout;
