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


const Header = () => {
    const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
    return (
        <>
            <section className="bg-gray-800 text-white p-4 flex justify-between items-center border-b border-b-gray-300 border-solid">
                <div className='flex items-center justify-between w-[95%] mx-auto'>
                    <div>
                        <p className='text-[14px] font-[500]'>Get up to 50% off new season styles, limited time only</p>
                    </div>

                    <div className='col2 flex items-center justify-between'>
                        <ul className='flex items-center gap-4'>
                            <li className='list-none'><Link to="#" className='text-white hover:text-red-300 text-[14px] font-[500] transition'>Shop Now</Link></li>
                            <li className='list-none'><Link to="#" className='text-white hover:text-red-300 text-[14px] font-[500] transition'>Learn More</Link></li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className='bg-white border-b border-b-gray-300 border-solid'>
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
                    </div> 
                </div>
            </div>
            </section>

            <section className='bg-white border-b border-b-gray-300 border-solid w-full'>
                <div className='flex justify-between items-center p-2.5 w-[95%] mx-auto'>
                   <div className='col1 w-[20%]'><Button className='flex items-center' onClick={()=>toggleDrawer(true)}><MenuOutlinedIcon className='mr-2'/>Shop By Category<ExpandMoreOutlinedIcon className='ml-6'/></Button></div>
                   <div className='col2 w-[60%] justify-center'>
                    <ul className='flex items-center gap-3 '>
                        <li className='list-none'><Link to="/"  className='link'><Button className='!text-[14px] !font-[500] !text-gray-800 hover:!text-red-500 transition'>home</Button></Link></li>
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
                   <div className='col3 w-[20%] flex justify-center'><RocketLaunchOutlinedIcon className='mr-2'/> Free International Delivery</div>
                </div>
            </section>

            <TemporaryDrawer open={open} toggleDrawer={toggleDrawer}/>

            <Hero2></Hero2>
        </>
    )
}

export default Header
