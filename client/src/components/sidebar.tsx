import { Button } from '@mui/material';
import React, { useState } from 'react'

const Sidebar = () => {

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(prevState => !prevState);
  };

  return (
    <div
            // className={`transition-transform duration-300 ${isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'} bg-black h-screen text-2xl text-white w-52`}
            className={`transition-transform duration-300 ${isSidebarCollapsed ? 'translate-x-full' : 'translate-x-0'} bg-black h-screen text-2xl text-white w-52 text-center`}
            style={{transform: isSidebarCollapsed ? 'translateX(-60%)' : 'translateX(0)'}}
          >
            <div>sidebar</div>
            <Button onClick={handleSidebarToggle} style={{ color: "white" }}>
              {isSidebarCollapsed ? "<<" : ">>"}
            </Button>
    </div>
  )
}

export default Sidebar
