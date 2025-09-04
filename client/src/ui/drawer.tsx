import Drawer from '@mui/material/Drawer';
// import Button from '@mui/material/Button';



interface sideDrawerProps {
  open: boolean;
  toggleDrawer: (newOpen: boolean, side?: 'left' | 'right' ) => void;
  anchor?: 'left' | 'right';
  drawerList : JSX.Element;
}

export default function SideDrawer({open, toggleDrawer, anchor, drawerList}: sideDrawerProps) {

  return (
     
      <Drawer open={open} onClose={()=>toggleDrawer(false, anchor)} anchor={anchor} disableScrollLock={true}>
        {drawerList}
      </Drawer>
    
  );
}


