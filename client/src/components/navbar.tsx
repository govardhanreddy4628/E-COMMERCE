import React from 'react'
import { AppBar, Box, Toolbar } from "@mui/material"
import { NavLink } from "react-router-dom"


const Navbar: React.FC = () => {
  return (
    <div>
       <AppBar color="primary" sx={{position:"relative"}} className='w-full'>
        <Toolbar sx={{justifyContent:"space-between"}}>
        <Box component="img">
            {/* <img src="" alt="logo"/> */}
        </Box>
        <Box sx={{display:"flex", gap:"16px"}}>
            
                <NavLink to="/admin">Admin</NavLink>
                <NavLink to="user">User</NavLink>
                <NavLink to="about">About</NavLink>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/counter">Counter</NavLink>
                <NavLink to="/signup"></NavLink>
            
        </Box>
        </Toolbar>
       
      </AppBar>
    </div>
  )
}

export default Navbar
