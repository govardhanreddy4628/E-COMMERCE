import { IoCloseSharp } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { GoTriangleDown } from "react-icons/go"
import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


const CartItem = () => {

    const [selectedSize, setSelectedSize] = useState<null | string>(null);
    const [selectedQty, setSelectedQty] = useState(1);

    const [sizeAnchorEl, setSizeAnchorEl] = useState<null | HTMLElement>(null);
    const [qtyAnchorEl, setQtyAnchorEl] = useState<null | HTMLElement>(null);

    const sizeopen = Boolean(sizeAnchorEl);
    const qtyopen = Boolean(qtyAnchorEl);

    const handleSizeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log(sizeAnchorEl)
        setSizeAnchorEl(event.currentTarget);
    };
    const handleQtyClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log(sizeAnchorEl)
        setQtyAnchorEl(event.currentTarget);
    };

    const handleSizeClose = (value: string | null) => {
        setSizeAnchorEl(null);
        console.log(selectedSize)
        if (value !== null) {
            setSelectedSize(value)
        }
    };
    const handleQtyClose = (value: number | null) => {
        setQtyAnchorEl(null);
        if (value !== null) {
            setSelectedQty(value);
        }
    };

    return (
        <div className='shadow-md rounded-md bg-white mb-2'>
            <div className='cartItem w-full p-3 flex items-center gap-4 pb-5 border-b border-[rgba(0,0,0,0.1)]'>
                <div className='img w-[15%] rounded-md overflow-hidden'>
                    <Link to="/product/7845" className='group'>
                        <img src='https://serviceapi.spicezgold.com/download/1742463096956_hbhb2.jpg' className='w-full group-hover:scale-105 transition-all' />
                    </Link>
                </div>

                <div className='info w-[85%] relative'>
                    <IoCloseSharp className='cursor-pointer absolute top-[0px] right-[0px] text-[22px] hover:text-red-500 transition-colors' />
                    <span className='text-[13px] text-gray-600'>Sanria</span>
                    <h3 className='text-[16px]'><Link to="" className='link'>A-Line Kurti With Sharara & Dupatta</Link></h3>
                    <div className='flex items-center gap-4 mt-2'>
                        <span className='price text-[14px] font-[600]'>$54.00</span>
                        <span className='oldPrice line-through text-gray-500 text-[14px] font-[500]'>$60.00</span>
                        <span className='price text-red-500 text-[14px] font-[600]'>10% OFF</span>
                    </div>

                    <div className='flex items-center gap-4 mt-2'>
                        <div className='relative'>
                            <span className='flex items-center justify-center bg-[#f1f1f1] text-[11px] font-[600] py-1 px-2 rounded-md cursor-pointer min-w-20 gap-2'
                                onClick={handleSizeClick}>Size: {selectedSize || "M"}
                                <GoTriangleDown /></span>
                            <Menu
                                id="size-menu"
                                aria-hidden="false"
                                anchorEl={sizeAnchorEl}
                                open={sizeopen}
                                onClose={()=>handleSizeClose(null)}

                            >
                                <MenuItem onClick={() => handleSizeClose("S")}>S</MenuItem>
                                <MenuItem onClick={() => handleSizeClose("M")}>M</MenuItem>
                                <MenuItem onClick={() => handleSizeClose("L")}>L</MenuItem>
                                <MenuItem onClick={() => handleSizeClose("XL")}>XL</MenuItem>
                                <MenuItem onClick={() => handleSizeClose("XXL")}>XXL</MenuItem>
                            </Menu>
                        </div>

                        <div>
                            <span className='flex items-center justify-center bg-[#f1f1f1] text-[11px] font-[600] py-1 px-2 rounded-md cursor-pointer gap-2'
                                onClick={handleQtyClick}>Qty: {selectedQty || 0}
                                <GoTriangleDown /></span>
                            <Menu
                                id="quantity-menu"
                                aria-hidden="false"
                                anchorEl={qtyAnchorEl}
                                open={qtyopen}
                                onClose={()=>handleQtyClose(null)}

                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((qty) => (
                                    <MenuItem key={qty} onClick={() => handleQtyClose(qty)}>{qty}</MenuItem>
                                ))}

                            </Menu>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartItem
