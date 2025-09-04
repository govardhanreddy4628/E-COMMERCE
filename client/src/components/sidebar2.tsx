// import Box from '@mui/material/Box';
// import Drawer from '@mui/material/Drawer';
// // import Button from '@mui/material/Button';
// import List from '@mui/material/List';
// import Divider from '@mui/material/Divider';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import MailIcon from '@mui/icons-material/Mail';


// interface TemporaryDrawerProps {
//   open: boolean;
//   toggleDrawer: (newOpen: boolean, side?: 'left' | 'right' | 'bottom') => void;
//   anchor?: 'left' | 'right' | 'bottom';
// }


// export default function TemporaryDrawer({open, toggleDrawer, anchor}: TemporaryDrawerProps) {
  

//   const DrawerList = (
//     <Box sx={{ width: anchor==="left"?250:380 }} role="presentation" onClick={()=>toggleDrawer(false, anchor)}>
//       <List>
//         {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
//           <ListItem key={text} disablePadding>
//             <ListItemButton>
//               <ListItemIcon>
//                 {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
//               </ListItemIcon>
//               <ListItemText primary={text} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>
//       <Divider />
//       <List>
//         {['All mail', 'Trash', 'Spam'].map((text, index) => (
//           <ListItem key={text} disablePadding>
//             <ListItemButton>
//               <ListItemIcon>
//                 {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
//               </ListItemIcon>
//               <ListItemText primary={text} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>
//     </Box>
//   );

//   return (
//     <div>
      
//       <Drawer open={open} onClose={()=>toggleDrawer(false, anchor)} anchor={anchor}>
//         {DrawerList}
//       </Drawer>
//     </div>
//   );
// }