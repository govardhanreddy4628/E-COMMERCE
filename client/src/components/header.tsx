import { Badge, Box, Button, IconButton, TextField } from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import SearchIcon from '@mui/icons-material/Search';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { useState } from 'react';
import { ThemeToggle } from '../ui/themeToggle';
import SideDrawer from '../ui/drawer';
import LeftMenu from './leftMenu';
import CartSidebar from './cartSidebar';
import Menu from '@mui/material/Menu';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/authContext';
import { accountMenu } from '../data/accountMenu';
import { useCart } from '../context/cartContext';
import { useWishlist } from '../context/wishlistContext'; // ✅ new
import { useCategories } from './admin/context/categoryContext';

const HIDDEN_SLUGS = ["miscellaneous"];
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
            { name: "Men", children: ["Shirts", "Trousers", "Shoes"] },
            { name: "Women", children: ["Dresses", "Heels", "Bags"] },
            { name: "Girls", children: ["Tops", "Jeans", "Shoes"] },
            { name: "Kids", children: ["Toys", "Clothing", "Accessories"] },
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

];


const Header = () => {
    const [open, setOpen] = useState(false);
    const [anchor, setAnchor] = useState<'left' | 'right'>('left');
    const [accanchorEl, setAccAnchorEl] = useState<null | HTMLElement>(null);

    const { getCartCount } = useCart();
    const { wishlist } = useWishlist(); // assuming your context exposes `wishlist` array
    const { user, logout } = useAuth();


    console.log(user)
    const { categories, loading } = useCategories();

    const visibleCategories = categories.filter(
        (cat) => cat.isActive && !HIDDEN_SLUGS.includes(cat.slug) && !cat.parentCategoryId
    ) ?? [];

    const navigate = useNavigate();


    const userMenuOpen = Boolean(accanchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAccAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAccAnchorEl(null);
    };

    console.log(user)

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

    const handleLogout = async () => {
        await logout();
        handleClose();
        navigate("/login", { replace: true });
    };

    const userInitial = user?.email?.charAt(0).toUpperCase() ?? "";
    return (
        <div className='relative'>
            {/* Top Header */}
            {isHome &&
                <section className="row1 max-w-8xl bg-foreground text-muted px-4 py-3 flex border-b border-border border-solid">
                    <div className='flex flex-col sm:flex-row items-center justify-between lg:w-[95%] w-full mx-auto'>
                        <p className='text-sm font-medium'>Get up to 50% off new season styles, limited time only</p>
                        <ul className='flex items-center gap-4  mt-2 sm:mt-0'>
                            <li><Link to="#" className='text-inherit hover:text-red-300 text-sm font-medium'>Help Center</Link></li>
                            <li><Link to="#" className='text-inherit hover:text-red-300 text-sm font-medium'>Order Tracking</Link></li>
                        </ul>
                    </div>
                </section>
            }

            {/* secondary header */}
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
                            {!user ? (
                                <ul className="flex items-center gap-4">
                                    <li className="list-none">
                                        <Link
                                            to="/login"
                                            className="hover:text-red-500 text-[16px] font-[500] transition"
                                        >
                                            Login
                                        </Link>
                                    </li>
                                    |
                                    <li className="list-none">
                                        <Link
                                            to="/signup"
                                            className="hover:text-red-500 text-[16px] font-[500] transition"
                                        >
                                            Signup
                                        </Link>
                                    </li>
                                </ul>
                            ) : (
                                <>
                                    {/* Avatar / Initial */}
                                    <div
                                        className="flex items-center gap-4 p-2 cursor-pointer"
                                        onClick={handleClick}
                                        aria-controls={userMenuOpen ? "account-menu" : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={userMenuOpen ? "true" : undefined}
                                    >
                                        {user.avatar ? (
                                            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300 dark:border-gray-700">
                                                <img
                                                    src={user.avatar}
                                                    alt="User Avatar"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-semibold uppercase">
                                                {userInitial}
                                            </div>
                                        )}
                                    </div>

                                    {/* Account Menu */}
                                    <Menu
                                        anchorEl={accanchorEl}
                                        id="account-menu"
                                        open={userMenuOpen}
                                        onClose={handleClose}
                                        onClick={handleClose}
                                        disableScrollLock
                                        transformOrigin={{ horizontal: "right", vertical: "top" }}
                                        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                                        slotProps={{
                                            paper: {
                                                elevation: 0,
                                                sx: {
                                                    overflow: "visible",
                                                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                                    mt: 1.5,
                                                    minWidth: 180,
                                                    "&::before": {
                                                        content: '""',
                                                        display: "block",
                                                        position: "absolute",
                                                        top: 0,
                                                        right: 14,
                                                        width: 10,
                                                        height: 10,
                                                        bgcolor: "background.paper",
                                                        transform: "translateY(-50%) rotate(45deg)",
                                                        zIndex: 0,
                                                    },
                                                },
                                            },
                                        }}
                                    >
                                        <div className="flex flex-col py-2 px-2">
                                            {accountMenu.map((item) => (
                                                <Button
                                                    key={item.id}
                                                    className="!flex gap-3 !justify-start hover:bg-gray-100 p-2 rounded-sm"
                                                >
                                                    <Link
                                                        to={`/myaccount/${item.path}`}
                                                        className="flex items-center gap-3"
                                                    >
                                                        {item.icon}
                                                        <span>{item.label}</span>
                                                    </Link>
                                                </Button>
                                            ))}

                                            <Button
                                                className="!flex gap-3 hover:bg-gray-100 p-2 rounded-sm justify-start"
                                                onClick={handleLogout}
                                            >
                                                <FiLogOut />
                                                <span>Logout</span>
                                            </Button>
                                        </div>
                                    </Menu>
                                </>
                            )}


                            <IconButton aria-label="favorite">
                                <Badge badgeContent={wishlist.length || 0} color="success">
                                    <FavoriteBorderIcon className='!w-5 lg:!w-6 !h-5 lg:!h-6 text-muted-foreground' />
                                </Badge>
                            </IconButton>
                            {/* or */}
                            {/* <IconButton aria-label="favorite" onClick={() => toggleDrawer(true, "left")}>
                                <Badge badgeContent={wishlist.length} color="success">
                                    <FavoriteBorderIcon className='!w-5 lg:!w-6 !h-5 lg:!h-6 text-muted-foreground' />
                                </Badge>
                            </IconButton> */}

                            <IconButton aria-label="cart" onClick={() => toggleDrawer(true, "right")}>
                                <Badge badgeContent={getCartCount} color="primary">
                                    <ShoppingCartCheckoutIcon className='!w-5 lg:!w-6 !h-5 lg:!h-6 text-muted-foreground' />
                                </Badge>
                            </IconButton>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </section>


            {/* tertiary header*/}
            <section className='row3 bg-background border-b border-b-border border-solid w-full'>
                <div className='flex justify-between items-center px-2.5 w-[95%] mx-auto'>

                    {/* LEFT */}
                    <div className='col1 w-[20%]'>
                        <Button
                            className='flex items-center !text-gray-800 dark:!text-slate-300'
                            onClick={() => toggleDrawer(true, "left")}
                        >
                            <MenuOutlinedIcon className='mr-2' />
                            <span className='hidden lg:flex'>
                                Shop By Category
                                <ExpandMoreOutlinedIcon className='ml-6' />
                            </span>
                        </Button>
                    </div>

                    {/* CENTER */}
                    <div className='col2 w-[60%] justify-center hidden lg:flex'>
                        <ul className="flex items-center gap-3">

                            {!isHome && (
                                <li className="list-none">
                                    <NavLink to="/" className="link">
                                        <Button>Home</Button>
                                    </NavLink>
                                </li>
                            )}

                            {!loading && visibleCategories.map((category) => (
                                <li key={category._id} className="list-none group relative">

                                    <div className="flex items-center justify-between relative">

                                        {/* LEVEL 0 */}
                                        <Link
                                            to={`/products?catId=${category._id}`}
                                            className="link py-2.5"
                                        >
                                            <Button className="!text-[14px] !font-[500] text-gray-800 dark:text-gray-100 hover:!text-red-500 transition">
                                                {category.name}
                                            </Button>
                                        </Link>

                                        {/* LEVEL 1 */}
                                        {category.children?.length > 0 && (
                                            <div className="absolute left-0 top-[48px] w-[160px] z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-[1] flex flex-col py-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-in-out">

                                                <ul className="list-none flex flex-col items-start justify-center w-full">

                                                    {category.children.map((sub) => (
                                                        <div key={sub._id} className="relative group/sub w-full">

                                                            <li className="p-2 capitalize hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition text-gray-800 dark:text-gray-100">

                                                                <Link
                                                                    to={`/products?catId=${sub._id}`}
                                                                    className="w-full"
                                                                >
                                                                    {sub.name}
                                                                </Link>

                                                                {/* LEVEL 2 */}
                                                                {sub.children?.length > 0 && (
                                                                    <div className="absolute left-[158px] top-0 w-[160px] z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-[1] flex flex-col gap-1 py-2 opacity-0 invisible translate-x-4 group-hover/sub:opacity-100 group-hover/sub:visible group-hover/sub:translate-x-0 transition-all duration-300 ease-in-out">

                                                                        <ul className="list-none flex flex-col items-start justify-center gap-1">

                                                                            {sub.children.map((child) => (
                                                                                <li
                                                                                    key={child._id}
                                                                                    className="p-2 capitalize hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer w-full text-[14px] font-[500] text-gray-800 dark:text-gray-100 transition"
                                                                                >
                                                                                    <Link to={`/products?catId=${child._id}`}>
                                                                                        {child.name}
                                                                                    </Link>
                                                                                </li>
                                                                            ))}

                                                                        </ul>
                                                                    </div>
                                                                )}

                                                            </li>
                                                        </div>
                                                    ))}

                                                </ul>
                                            </div>
                                        )}

                                    </div>
                                </li>
                            ))}

                        </ul>
                    </div>

                    {/* RIGHT */}
                    <div className='col3 w-[20%] flex justify-center text-slate-800 dark:text-slate-300 text-nowrap py-3 lg:py-0'>
                        <RocketLaunchOutlinedIcon className='mr-2' />
                        Super Fast Delivery
                    </div>

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

