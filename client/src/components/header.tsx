import { Badge, Button, IconButton, TextField } from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import SearchIcon from '@mui/icons-material/Search';
import { Link, NavLink } from 'react-router-dom';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import Hero2 from './hero2';
import { useState } from 'react';
import TemporaryDrawer from './sidebar2';
import Footer from './footer';
import { ThemeToggle } from '../ui/themeToggle';


const Header = () => {
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => {
        setOpen(newOpen);
    };
    return (
        <>
            <section className="bg-gray-800 dark:bg-white text-white dark:text-black p-4 flex justify-between items-center border-b border-b-gray-300 border-solid">
                <div className='flex items-center justify-between w-[95%] mx-auto'>
                    <div>
                        <p className='text-[14px] font-[500]'>Get up to 50% off new season styles, limited time only</p>
                    </div>

                    <ul className='flex items-center gap-4 '>
                        <li className='list-none'><Link to="#" className='text-inherit hover:text-red-300 text-[14px] font-[500] transition'>Help Center</Link></li>
                        <li className='list-none'><Link to="#" className='text-inherit hover:text-red-300 text-[14px] font-[500] transition'>Order Tracking</Link></li>
                    </ul>

                </div>
            </section>

            <section className='bg-white dark:bg-black border-b border-b-gray-300 border-solid'>
                <div className='flex justify-between items-center p-2.5 w-[95%] mx-auto '>
                    <div className='col1 w-[30%]'><img src="https://serviceapi.spicezgold.com/download/1744255975457_logo.jpg" /></div>
                    <div className='col2 w-[40%] bg-gray-200 rounded-[6px] flex items-center justify-between overflow-hidden'>
                        <TextField variant='outlined' type="text" className='searchBox border-none bg-inherit text-[35px] w-[90%] focus:outline-none' placeholder='search for Product' />
                        <div className='w-[10%] flex items-center justify-center'>
                            <IconButton aria-label="search" className='!text-red' >
                                <SearchIcon className='!text-[32px]' />
                            </IconButton>
                        </div>
                    </div>
                    <div className='col3 w-[30%] flex justify-center p-4 items-center'>
                        <div className='flex items-center justify-end w-full gap-4'>
                            <ul className='flex items-center gap-4'>
                                <li className='list-none'><Link to="#" className='text-gray-800 hover:text-red-500 text-[16px] font-[500] transition'>Login</Link></li> |
                                <li className='list-none'><Link to="#" className='text-gray-800 hover:text-red-500 text-[16px] font-[500] transition'>Register</Link></li>
                            </ul>

                            <IconButton aria-label="favorite">
                                <Badge badgeContent={4} color="success">
                                    <FavoriteBorderIcon />
                                </Badge>
                            </IconButton>

                            <IconButton aria-label="cart">
                                <Badge badgeContent={2} color="primary">
                                    <ShoppingCartCheckoutIcon />
                                </Badge>
                            </IconButton>

                            <ThemeToggle />

                        </div>
                    </div>
                </div>
            </section>

            <section className='bg-white dark:bg-black border-b border-b-gray-300 border-solid w-full'>
                <div className='flex justify-between items-center px-2.5 w-[95%] mx-auto'>
                    <div className='col1 w-[20%]'><Button className='flex items-center' onClick={() => toggleDrawer(true)}><MenuOutlinedIcon className='mr-2' />Shop By Category<ExpandMoreOutlinedIcon className='ml-6' /></Button></div>
                    <div className='col2 w-[60%] justify-center'>
                        <ul className='flex items-center gap-3 '>
                            <li className='list-none group relative'>
                                <div className='flex items-center justify-between relative'>
                                    <Link to="/" className='link py-2.5'>
                                        <Button className='!text-[14px] !font-[500] !text-gray-800 hover:!text-red-500 transition '>home</Button>
                                    </Link>
                                    <div className="absolute left-0 top-[48px] w-[160px] z-50 bg-white border border-gray-200 shadow-lg rounded-[1] flex flex-col py-2 opacity-0 invisible translate-y-2
                                    group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-00 ease-in-out"
                                    >
                                        <ul className='list-none flex flex-col items-start justify-center w-full'>
                                            {["fashion", "fashion", "fashion", "fashion", "fashion"].map((item, index) => (
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
                                                                {["fashion", "fashion", "fashion", "fashion", "fashion"].map((item, subindex) => (
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


                            <li className="list-none group relative">
                                <div className="flex items-center justify-between relative">
                                    <Link to="/" className="link">
                                        <Button className="!text-[14px] !font-[500] !text-gray-800 hover:!text-red-500 transition">
                                            Home
                                        </Button>
                                    </Link>

                                    {/* Dropdown */}
                                    <div
                                        className="absolute left-0 top-[48px] w-[160px] z-50 bg-white border border-gray-200 shadow-black rounded-[1] flex flex-col gap-1 py-2
        opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
        transition-all duration-300 ease-in-out"
                                    >
                                        <ul className="list-none flex flex-col items-start justify-center pr-4 gap-1">
                                            {/* Item with submenu */}
                                            <li className="p-2 capitalize hover:text-red-500 cursor-pointer transition relative group/sub">
                                                fashion
                                                {/* Submenu */}
                                                <ul
                                                    className="absolute top-0 left-full ml-2 w-[140px] bg-white border border-gray-200 shadow-lg rounded-[1]
              opacity-0 invisible translate-x-2 group-hover/sub:opacity-100 group-hover/sub:visible group-hover/sub:translate-x-0
              transition-all duration-300 ease-in-out"
                                                >
                                                    <li className="p-2 hover:text-red-500 transition">Men</li>
                                                    <li className="p-2 hover:text-red-500 transition">Women</li>
                                                    <li className="p-2 hover:text-red-500 transition">Kids</li>
                                                </ul>
                                            </li>

                                            {/* Regular items */}
                                            <li className="p-2 capitalize hover:text-red-500 cursor-pointer transition">fashion</li>
                                            <li className="p-2 capitalize hover:text-red-500 cursor-pointer transition">fashion</li>
                                            <li className="p-2 capitalize hover:text-red-500 cursor-pointer transition">fashion</li>
                                            <li className="p-2 capitalize hover:text-red-500 cursor-pointer transition">fashion</li>
                                        </ul>
                                    </div>
                                </div>
                            </li>



                            {/* 
                            | Class       | Visible? | Takes up space? | Interactive? (click/focus) | Animatable?                                       |
| ----------- | -------- | --------------- | -------------------------- | ------------------------------------------------- |
| `opacity-0` | ❌ No     | ✅ Yes           | ✅ Yes                      | ✅ Yes                                             |
| `invisible` | ❌ No     | ✅ Yes           | ❌ No                       | ❌ No (visibility not animatable in most browsers) |
| `hidden`    | ❌ No     | ❌ No            | ❌ No                       | ❌ No                                              |


invisible(tailwind css) =====> visibility: hidden;(css)
hidden(tailwind css) =====> display: none; (css) */}





                            <li className='list-none'><NavLink to="/" className='link'><Button>fassion</Button></NavLink></li>
                            <li className='list-none'><NavLink to="/" className='link'><Button>electronics</Button></NavLink></li>
                            <li className='list-none'><NavLink to="/" className='link'><Button>bags</Button></NavLink></li>
                            <li className='list-none'><NavLink to="/" className='link'><Button>footware</Button></NavLink></li>
                            <li className='list-none'><NavLink to="/" className='link'><Button>groceries</Button></NavLink></li>
                            <li className='list-none'><NavLink to="/" className='link'><Button>beauty</Button></NavLink></li>
                            <li className='list-none'><NavLink to="/" className='link'><Button>wellness</Button></NavLink></li>
                            <li className='list-none'><NavLink to="/" className='link'><Button>jewellery</Button></NavLink></li>
                        </ul>
                    </div>
                    <div className='col3 w-[20%] flex justify-center'><RocketLaunchOutlinedIcon className='mr-2' /> Free International Delivery</div>
                </div>
            </section>

            <TemporaryDrawer open={open} toggleDrawer={toggleDrawer} />

            <Hero2></Hero2>
            <Footer />
        </>
    )
}

export default Header
