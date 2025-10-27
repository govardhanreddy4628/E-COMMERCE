import { Badge, Box, Button, IconButton, TextField } from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import SearchIcon from '@mui/icons-material/Search';
import { Link, NavLink, useLocation } from 'react-router-dom';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { useState } from 'react';
import { ThemeToggle } from '../ui/themeToggle';
import SideDrawer from '../ui/drawer';
import LeftMenu from './leftMenu';
import CartSidebar from './cartSidebar';
import { useAuth } from '../hooks/useAuth';
import Menu from '@mui/material/Menu';
import { IoBagCheckOutline, IoLocationOutline } from 'react-icons/io5';
import { FaRegHeart, FaRegUser } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";


import { FiLogOut } from 'react-icons/fi';

interface Category {
    name: string;
    path: string;
    subcategories: {
        name: string;
        children: string[];
    }[];
}


const categories: Category[] = [
    {
        name: "fashion",
        path: "/productcategory",
        subcategories: [
            {
                name: "Men",
                children: ["Shirts", "Trousers", "Shoes"]
            },
            {
                name: "Women",
                children: ["Dresses", "Heels", "Bags"]
            },
            {
                name: "Girls",
                children: ["Tops", "Jeans", "Shoes"]
            },
            {
                name: "Kids",
                children: ["Toys", "Clothing", "Accessories"]
            },
        ]
    },
    {
        name: "electronics",
        path: "/electronics",
        subcategories: [
            { name: "Mobiles", children: ["Android", "iOS", "Accessories"] },
            { name: "Laptops", children: ["Gaming", "Ultrabooks", "Accessories"] },
        ]
    },
    {
        name: "bags",
        path: "/bags",
        subcategories: [
            { name: "Handbags", children: ["Leather", "Fabric", "Designer"] },
            { name: "Backpacks", children: ["Laptop", "Travel", "Casual"] },
        ]
    },
    {
        name: "footwear",
        path: "/footwear",
        subcategories: [
            { name: "Men", children: ["Sneakers", "Sandals", "Formal"] },
            { name: "Women", children: ["Heels", "Flats", "Boots"] },
        ]
    },
    {
        name: "groceries",
        path: "/groceries",
        subcategories: [
            { name: "Fruits", children: ["Fresh", "Frozen"] },
            { name: "Vegetables", children: ["Leafy", "Root"] },
        ]
    },
    {
        name: "beauty",
        path: "/beauty",
        subcategories: [
            { name: "Skincare", children: ["Face", "Body", "Sunscreen"] },
            { name: "Makeup", children: ["Lipstick", "Foundation", "Blush"] },
        ]
    },
    {
        name: "wellness",
        path: "/wellness",
        subcategories: [
            { name: "Supplements", children: ["Vitamins", "Proteins"] },
            { name: "Fitness", children: ["Yoga", "Gym Equipment"] },
        ]
    },
    {
        name: "jewellery",
        path: "/jewellery",
        subcategories: [
            { name: "Gold", children: ["Necklace", "Rings"] },
            { name: "Silver", children: ["Bracelets", "Earrings"] },
        ]
    }
];

const Header = () => {
    const [open, setOpen] = useState(false);
    const [anchor, setAnchor] = useState<'left' | 'right'>('left');
    const [accanchorEl, setAccAnchorEl] = useState<null | HTMLElement>(null);
    const userMenuOpen = Boolean(accanchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAccAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAccAnchorEl(null);
    };

    const { isLogin } = useAuth();

    const toggleDrawer = (newOpen: boolean, side: 'left' | 'right' = "left") => {
        setOpen(newOpen);
        setAnchor(side)
    };

    const leftDrawerList = (
        <Box
            sx={{ width: anchor === "left" ? 250 : 380 }}
            role="presentation"
        // {...(anchor === "left" ? { onClick: () => toggleDrawer(false, anchor) } : {})}
        // onKeyDown={() => toggleDrawer(false, anchor)}
        >
            {anchor === "left" ? <LeftMenu /> : <CartSidebar setOpen={setOpen} />}
        </Box>
    );


    const location = useLocation();
    const isHome = location.pathname === "/";


    return (
        <div className='relative'>
            {/* Top Bar */}
            <section className="row1 max-w-8xl bg-foreground text-muted px-4 py-3 flex border-b border-border border-solid">
                <div className='flex flex-col sm:flex-row items-center justify-between lg:w-[95%] w-full mx-auto'>
                    <p className='text-sm font-medium'>Get up to 50% off new season styles, limited time only</p>
                    <ul className='flex items-center gap-4  mt-2 sm:mt-0'>
                        <li><Link to="#" className='text-inherit hover:text-red-300 text-sm font-medium'>Help Center</Link></li>
                        <li><Link to="#" className='text-inherit hover:text-red-300 text-sm font-medium'>Order Tracking</Link></li>
                    </ul>
                </div>
            </section>


            <section className='row2 bg-background  border-b border-b-border border-solid'>
                <div className='flex justify-between items-center p-2.5 w-[95%] mx-auto '>
                    <div className='col1 w-[30%]'><img src="https://serviceapi.spicezgold.com/download/1744255975457_logo.jpg" /></div>
                    <div className='col2 w-[40%] bg-slate-300 rounded-[8px] lg:flex items-center justify-between overflow-hidden hidden'>
                        <TextField variant='outlined' size='small' type="text" className='searchBox border-none text-[35px] w-[90%] focus:outline-none !py-1' placeholder='Search for Product' />
                        <div className='w-[10%] flex items-center justify-center'>
                            <IconButton aria-label="search" className='!text-red' >
                                <SearchIcon className='!text-[28px]' />
                            </IconButton>
                        </div>
                    </div>
                    <div className='col3 w-[30%] flex justify-center p-4 items-center'>
                        <div className='flex items-center justify-end w-full gap-4'>
                            {!isLogin ? <ul className='flex items-center gap-4'>
                                <li className='list-none'><Link to="/Login" className='text-gray-950 hover:text-red-500 text-[16px] font-[500] transition'>Login</Link></li> |
                                <li className='list-none'><Link to="/signup" className='text-gray-950 hover:text-red-500 text-[16px] font-[500] transition'>Register</Link></li>
                            </ul>
                                :
                                <>
                                    <div className="flex items-center gap-4 p-2 bg-inherit max-w-56 cursor-pointer" onClick={handleClick}>
                                        <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-300 dark:border-gray-700"
                                            aria-controls={userMenuOpen ? 'account-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={userMenuOpen ? 'true' : undefined}>
                                            <img
                                                src={"https://i.pinimg.com/originals/2a/9a/a2/2a9aa2765b453d34bf23f0b253ebbcb3.jpg"}
                                                alt="User Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className='hidden lg:block'>
                                            <p className="text-sm font-semibold text-muted-foreground">{"john Doe"}</p>
                                            <p className="text-xs text-muted-foreground">{"johndoe@gmail.com"}</p>
                                        </div>
                                    </div>

                                    <Menu
                                        anchorEl={accanchorEl}
                                        id="account-menu"
                                        open={userMenuOpen}
                                        onClose={handleClose}
                                        onClick={handleClose}
                                        disableScrollLock={true}
                                        slotProps={{
                                            paper: {
                                                elevation: 0,
                                                sx: {
                                                    overflow: 'visible',
                                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                                    mt: 1.5,
                                                    minWidth: 180,
                                                    '& .MuiMenuItem-root': {
                                                        py: 1, // reduce vertical padding
                                                    },

                                                    '&::before': {
                                                        content: '""',
                                                        display: 'block',
                                                        position: 'absolute',
                                                        top: 0,
                                                        right: 14,
                                                        width: 10,
                                                        height: 10,
                                                        bgcolor: 'background.paper',
                                                        transform: 'translateY(-50%) rotate(45deg)',
                                                        zIndex: 0,
                                                    },
                                                },
                                            },
                                        }}
                                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                    >

                                        {/* <MenuItem onClick={handleClose}>
                                            <ListItemIcon>
                                                <FaRegUser fontSize="small" />
                                            </ListItemIcon>
                                            My Profile
                                        </MenuItem>
                                        <MenuItem onClick={handleClose}>
                                            <ListItemIcon>
                                                <IoLocationOutline fontSize="small" />
                                            </ListItemIcon>
                                            My Location
                                        </MenuItem>
                                        <MenuItem onClick={handleClose}>
                                            <ListItemIcon>
                                                <FaRegHeart fontSize="small" />
                                            </ListItemIcon>
                                            my List
                                        </MenuItem>
                                        <MenuItem onClick={handleClose}>
                                            <ListItemIcon>
                                                <IoBagCheckOutline fontSize="small" />
                                            </ListItemIcon>
                                            my Orders
                                        </MenuItem>
                                        <MenuItem onClick={handleClose}>
                                            <ListItemIcon>
                                                <FiLogOut fontSize="small" />
                                            </ListItemIcon>
                                            Logout
                                        </MenuItem> */}
                                        <div className=" flex gap-1 flex-col py-2 px-2 transition-all ease-in-out">
                                            <Button className="!flex gap-3 !items-center !justify-start hover:bg-gray-100 p-2 rounded-sm "><FaRegUser /><span>My Profile</span></Button>
                                            <Button className="!flex gap-3 !items-center !justify-start hover:bg-gray-100 p-2 rounded-sm "><FaRegHeart /><span>My List</span></Button>
                                            <Button className="!flex gap-3 !items-center !justify-start hover:bg-gray-100 p-2 rounded-sm "><IoBagCheckOutline /><span>My Orders</span></Button>
                                            <Button className="!flex gap-3 !items-center !justify-start hover:bg-gray-100 p-2 rounded-sm "><IoLocationOutline /><span>My Address</span></Button>
                                            <Button className="!flex gap-3 !items-center !justify-start hover:bg-gray-100 p-2 rounded-sm "><FiLogOut /><span>Logout</span></Button>
                                        </div>
                                    </Menu>

                                </>

                            }

                            <IconButton aria-label="favorite">
                                <Badge badgeContent={4} color="success">
                                    <FavoriteBorderIcon className='!w-5 lg:!w-6 !h-5 lg:!h-6 text-muted-foreground' />
                                </Badge>
                            </IconButton>
                            <IconButton aria-label="cart" onClick={() => toggleDrawer(true, "right")}>
                                <Badge badgeContent={2} color="primary">
                                    <ShoppingCartCheckoutIcon className='!w-5 lg:!w-6 !h-5 lg:!h-6 text-muted-foreground' />
                                </Badge>
                            </IconButton>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </section>

            <section className='row3 bg-background border-b border-b-border border-solid w-full'>
                <div className='flex justify-between items-center px-2.5 w-[95%] mx-auto'>
                    <div className='col1 w-[20%]'><Button className='flex items-center !text-gray-800' onClick={() => toggleDrawer(true, "left")}><MenuOutlinedIcon className='mr-2' /><span className='hidden lg:flex'>Shop By Category<ExpandMoreOutlinedIcon className='ml-6' /></span></Button></div>
                    <div className='col2 w-[60%] justify-center hidden lg:flex'>

                        {/* <ul className='flex items-center gap-3 '>
                            <li className={`list-none ${isHome ? "hidden" : ""}`}><NavLink to="/" className='link'><Button>Home</Button></NavLink></li>
                            <li className='list-none group relative'>
                                <div className='flex items-center justify-between relative'>
                                    <Link to="/productcategory" className='link py-2.5'>
                                        <Button className='!text-[14px] !font-[500] !text-muted-background hover:!text-red-500 transition '>fassion</Button>
                                    </Link>
                                    <div className="absolute left-0 top-[48px] w-[160px] z-50 bg-white border border-gray-200 shadow-lg rounded-[1] flex flex-col py-2 opacity-0 invisible translate-y-2
                                    group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-00 ease-in-out"
                                    >
                                        <ul className='list-none flex flex-col items-start justify-center w-full'>
                                            {["Men", "Women", "Girls", "kids"].map((item, index) => (
                                                <div className="relative group/sub w-full" key={index}>
                                                    <li
                                                        key={index}
                                                        className="p-2 capitalize hover:text-red-500 hover:bg-[rgba(147,101,101,0.1)] cursor-pointer transition relative group/sub"
                                                    >
                                                        {item}
                                                        <div className="absolute left-[158px] top-[0px] w-[160px] z-50 bg-white border border-gray-200 shadow-lg rounded-[1] flex flex-col gap-1 py-2 opacity-0 invisible translate-x-4
                                                         group-hover/sub:opacity-100 group-hover/sub:visible group-hover/sub:translate-x-0 transition-all duration-300 ease-in-out"
                                                        >
                                                            <ul className='list-none flex flex-col items-start justify-center gap-1'>
                                                                {["Men", "Women", "Girls", "kids"].map((item, subindex) => (
                                                                    <li
                                                                        key={subindex}
                                                                        className="p-2 capitalize hover:text-red-500 cursor-pointer hover:bg-[rgba(147,101,101,0.1)] w-full text-[14px] font-[500] text-gray-800 transition"
                                                                    >
                                                                        {item}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </li>
                                                </div>

                                            ))}

                                        </ul>
                                    </div>
                                </div>
                            </li>


                          


                            <li className='list-none'><NavLink to="/" className='link'><Button>electronics</Button></NavLink></li>
                            <li className='list-none'><NavLink to="/" className='link'><Button>bags</Button></NavLink></li>
                            <li className='list-none'><NavLink to="/" className='link'><Button>footware</Button></NavLink></li>
                            <li className='list-none'><NavLink to="/" className='link'><Button>groceries</Button></NavLink></li>
                            <li className='list-none'><NavLink to="/" className='link'><Button>beauty</Button></NavLink></li>
                            <li className='list-none'><NavLink to="/" className='link'><Button>wellness</Button></NavLink></li>
                            <li className='list-none'><NavLink to="/" className='link'><Button>jewellery</Button></NavLink></li>
                        </ul> */}

                        <ul className="flex items-center gap-3">
                            {!isHome && (
                                <li className="list-none">
                                    <NavLink to="/" className="link">
                                        <Button>Home</Button>
                                    </NavLink>
                                </li>
                            )}

                            {categories.map((category, idx) => (
                                <li key={idx} className="list-none group relative">
                                    <div className="flex items-center justify-between relative">
                                        <Link to={category.path} className="link py-2.5">
                                            <Button className="!text-[14px] !font-[500] !text-muted-background hover:!text-red-500 transition">
                                                {category.name}
                                            </Button>
                                        </Link>

                                        <div className="absolute left-0 top-[48px] w-[160px] z-50 bg-white border border-gray-200 shadow-lg rounded-[1] flex flex-col py-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-in-out">
                                            <ul className="list-none flex flex-col items-start justify-center w-full">
                                                {category.subcategories.map((sub, subIndex) => (
                                                    <div key={subIndex} className="relative group/sub w-full">
                                                        <li className="p-2 capitalize hover:text-red-500 hover:bg-[rgba(147,101,101,0.1)] cursor-pointer transition relative group/sub">
                                                            {sub.name}

                                                            <div className="absolute left-[158px] top-0 w-[160px] z-50 bg-white border border-gray-200 shadow-lg rounded-[1] flex flex-col gap-1 py-2 opacity-0 invisible translate-x-4 group-hover/sub:opacity-100 group-hover/sub:visible group-hover/sub:translate-x-0 transition-all duration-300 ease-in-out">
                                                                <ul className="list-none flex flex-col items-start justify-center gap-1">
                                                                    {sub.children.map((child, childIndex) => (
                                                                        <li
                                                                            key={childIndex}
                                                                            className="p-2 capitalize hover:text-red-500 cursor-pointer hover:bg-[rgba(147,101,101,0.1)] w-full text-[14px] font-[500] text-gray-800 transition"
                                                                        >
                                                                            {child}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </li>
                                                    </div>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className='col3 w-[20%] flex justify-center text-muted-foreground text-nowrap py-3 lg:py-0'><RocketLaunchOutlinedIcon className='mr-2' /> Free International Delivery</div>
                </div>
            </section>

            <SideDrawer open={open} toggleDrawer={toggleDrawer} anchor={anchor} drawerList={leftDrawerList} />
           
        </div>
    )
}

export default Header




{/* 
                            | Class       | Visible? | Takes up space? | Interactive? (click/focus) | Animatable?                                       |
| ----------- | -------- | --------------- | -------------------------- | ------------------------------------------------- |
| `opacity-0` | ❌ No     | ✅ Yes           | ✅ Yes                      | ✅ Yes                                             |
| `invisible` | ❌ No     | ✅ Yes           | ❌ No                       | ❌ No (visibility not animatable in most browsers) |
| `hidden`    | ❌ No     | ❌ No            | ❌ No                       | ❌ No                                              |


invisible(tailwind css) =====> visibility: hidden;(css)
hidden(tailwind css) =====> display: none; (css) */}







//     return (
//         <>
//             {/* Top Bar */}
//             <section className="bg-gray-800 dark:bg-white text-white dark:text-black px-4 py-2 border-b border-gray-300">
//                 <div className='flex flex-col sm:flex-row justify-between items-center w-full max-w-7xl mx-auto'>
//                     <p className='text-sm font-medium text-center sm:text-left'>Get up to 50% off new season styles, limited time only</p>
//                     <ul className='flex items-center gap-4 mt-2 sm:mt-0'>
//                         <li><Link to="#" className='text-inherit hover:text-red-300 text-sm font-medium'>Help Center</Link></li>
//                         <li><Link to="#" className='text-inherit hover:text-red-300 text-sm font-medium'>Order Tracking</Link></li>
//                     </ul>
//                 </div>
//             </section>

//             {/* Logo + Search + User Icons */}
//             <section className='bg-white dark:bg-black border-b border-gray-300'>
//                 <div className='flex flex-col md:flex-row items-center justify-between py-4 px-4 max-w-7xl mx-auto w-full gap-4'>
//                     {/* Logo */}
//                     <div className='w-full md:w-1/3 text-center md:text-left'>
//                         <img src="https://serviceapi.spicezgold.com/download/1744255975457_logo.jpg" alt="Logo" className='h-10 mx-auto md:mx-0' />
//                     </div>

//                     {/* Search Bar */}
//                     <div className='w-full md:w-1/3 flex items-center bg-slate-100 rounded-lg overflow-hidden'>
//                         <TextField
//                             variant='outlined'
//                             size='small'
//                             type="text"
//                             fullWidth
//                             placeholder='Search for Product'
//                             className='bg-transparent'
//                             InputProps={{
//                                 className: 'bg-transparent text-base',
//                             }}
//                         />
//                         <IconButton aria-label="search" className='text-red-600'>
//                             <SearchIcon />
//                         </IconButton>
//                     </div>

//                     {/* User/Profile + Cart + Wishlist */}
//                     <div className='w-full md:w-1/3 flex justify-end items-center gap-3'>
//                         {!isLogin ? (
//                             <ul className='hidden sm:flex items-center gap-3'>
//                                 <li><Link to="#" className='text-gray-800 hover:text-red-500 text-sm font-medium'>Login</Link></li>
//                                 <span className='text-gray-400'>|</span>
//                                 <li><Link to="#" className='text-gray-800 hover:text-red-500 text-sm font-medium'>Register</Link></li>
//                             </ul>
//                         ) : (
//                             <div className='flex items-center gap-3'>
//                                 <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-300">
//                                     <img
//                                         src="https://i.pinimg.com/originals/2a/9a/a2/2a9aa2765b453d34bf23f0b253ebbcb3.jpg"
//                                         alt="User"
//                                         className="w-full h-full object-cover"
//                                     />
//                                 </div>
//                                 <div className='hidden lg:block'>
//                                     <p className="text-sm font-semibold text-gray-800">John Doe</p>
//                                     <p className="text-xs text-gray-500">johndoe@gmail.com</p>
//                                 </div>
//                             </div>
//                         )}

//                         <IconButton aria-label="wishlist">
//                             <Badge badgeContent={4} color="success">
//                                 <FavoriteBorderIcon />
//                             </Badge>
//                         </IconButton>
//                         <IconButton aria-label="cart" onClick={() => toggleDrawer(true, "right")}>
//                             <Badge badgeContent={2} color="primary">
//                                 <ShoppingCartCheckoutIcon />
//                             </Badge>
//                         </IconButton>
//                         <ThemeToggle />
//                     </div>
//                 </div>
//             </section>

//             {/* Nav Section */}
//             <section className='bg-white dark:bg-black border-b border-gray-300'>
//                 <div className='flex items-center justify-between px-4 max-w-7xl mx-auto w-full py-2'>
//                     {/* Category Menu (Hamburger on mobile) */}
//                     <div className='w-auto'>
//                         <Button className='flex items-center text-sm' onClick={() => toggleDrawer(true, "left")}>
//                             <MenuOutlinedIcon className='mr-2' />
//                             <span className='hidden lg:flex'>Shop By Category <ExpandMoreOutlinedIcon className='ml-2' /></span>
//                         </Button>
//                     </div>

//                     {/* Navigation Links */}
//                     <div className='hidden lg:flex items-center flex-wrap gap-2 justify-center w-full'>
//                         {['home', 'fassion', 'electronics', 'bags', 'footware', 'groceries', 'beauty', 'wellness', 'jewellery'].map((label, index) => (
//                             <NavLink key={index} to="/" className='link'>
//                                 <Button className='!text-[14px] !font-[500] !text-gray-800 hover:!text-red-500 transition'>{label}</Button>
//                             </NavLink>
//                         ))}
//                     </div>

//                     {/* Right text (free delivery) */}
//                     <div className='hidden md:flex items-center text-sm font-medium text-gray-600'>
//                         <RocketLaunchOutlinedIcon className='mr-2' /> Free International Delivery
//                     </div>
//                 </div>
//             </section>
//         </>
//     );
// };

// export default Header;
