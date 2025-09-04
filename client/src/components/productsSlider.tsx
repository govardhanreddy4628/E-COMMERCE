import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { IoExpand } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';




const ProductsSlider = ({handleClickOpen}) => {
    return (
        <div className='categorySwiper my-8'>
            <div className='w-[95%] mx-auto'>
                <Swiper
                    // onSwiper={setSwiperRef}
                    slidesPerView={6}
                    spaceBetween={10}
                    navigation={true}
                    modules={[Navigation]}
                    className="mySwiper"
                >
                    <SwiperSlide>
                        <div className='bg-white border border-gray-200 shadow-md rounded-md flex flex-col items-center relative overflow-hidden'>
                            <div className='bg-white w-full flex items-center justify-center border-1 border-gray-200 relative group'>
                                <Link to="/" className='w-full h-[200px] relative overflow-hidden'>
                                    <img src="https://serviceapi.spicezgold.com/download/1742463096955_hbhb1.jpg" className='w-full opacity-100 hover:opacity-0 transition duration-500' />
                                    <img src="https://serviceapi.spicezgold.com/download/1742463096956_hbhb2.jpg" className='w-full absolute top-[0px] left-[0px] opacity-0  group-hover:scale-105 group-hover:opacity-100 group-hover:z-50 transition duration-500' />
                                </Link>
                                <div className='bg-red-400 rounded-md absolute left-[10px] top-[10px] text-[14px] px-2 py-1 z-50'>10%</div>
                                <div className="absolute right-[10px] -top-[100%] flex flex-col gap-[5px] p-1 transition-all z-50 duration-400 group-hover:top-[10px]">
                                    <div className='h-[35px] w-[35px] rounded-full bg-white  flex items-center justify-center hover:bg-red-500 hover:text-white transition-all' onClick={handleClickOpen}><IoExpand /></div>
                                    <div className='h-[35px] w-[35px] rounded-full bg-white flex items-center justify-center hover:bg-red-500 hover:text-white transition-all'><FaRegHeart /></div>
                                    <div className='h-[35px] w-[35px] rounded-full bg-white flex items-center justify-center hover:bg-red-500 hover:text-white transition-all'><FaRegHeart /></div>
                                </div>
                            </div>

                            <div className='info flex flex-col itms-center hustify-center w-full p-3'>
                                <h6 className='text-[13px] font-[200] capitalize mt-2'><Link to="/" className='link'>Product Name</Link></h6>
                                <h3 className='text-[14px] font-[500] text-gray-600 leading-[20px] mt-2 text-[rgba(0,0,0,0.9)] transition-all'><Link to="/" className='link'>Description of the product goes here.</Link></h3>
                                <div className='flex items-center justify-between w-full p-2'>
                                    <p className='text-[18px] font-bold line-through'>$99.99</p>
                                    <p className='text-[18px] font-bold text-red-400'>$99.99</p>
                                </div>
                                <Button className='flex items-center justify-center !w-[90%] !border-[1.5px] !border-solid !border-red-400 !bg-inherit !text-red-400 !mx-auto gap-3 !my-4'><ShoppingCartCheckoutIcon /> ADD TO CART</Button>
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className='bg-white border border-gray-200 shadow-md rounded-md flex flex-col items-center relative overflow-hidden'>
                            <div className='bg-white w-full flex items-center justify-center border-1 border-gray-200 relative group'>
                                <Link to="/" className='w-full h-[200px] relative '>
                                    <img src="https://serviceapi.spicezgold.com/download/1742463096955_hbhb1.jpg" className='w-full h-full opacity-100 hover:opacity-0 transition duration-500' />
                                    <img src="https://serviceapi.spicezgold.com/download/1742463096956_hbhb2.jpg" className='w-full h-full object-cover absolute top-[0px] left-[0px] opacity-0  group-hover:scale-105 group-hover:opacity-100 group-hover:z-50 transition duration-500' />
                                </Link>
                                <div className='bg-red-400 rounded-md absolute left-[10px] top-[10px] text-[14px] px-2 py-1 z-50'>10%</div>
                                <div className="absolute right-[10px] -top-[100%] flex flex-col gap-[5px] p-1 transition-all z-50 duration-400 group-hover:top-[10px]">
                                    <div className='h-[35px] w-[35px] rounded-full bg-white dark:bg-gray-800 dark:text-gray-200 flex items-center justify-center hover:bg-red-400 hover:text-white transition-all'><IoExpand /></div>
                                    <div className='h-[35px] w-[35px] rounded-full bg-white dark:bg-gray-800 dark:text-gray-200 flex items-center justify-center hover:bg-red-400 hover:text-white transition-all'><FaRegHeart /></div>
                                    <div className='h-[35px] w-[35px] rounded-full bg-white dark:bg-gray-800 dark:text-gray-200 flex items-center justify-center hover:bg-red-400 hover:text-white transition-all'><FaRegHeart /></div>
                                </div>
                            </div>

                            <div className='info flex flex-col itms-center hustify-center w-full p-3'>
                                <h6 className='text-[13px] font-[200] capitalize mt-2'><Link to="/" className='link'>Product Name</Link></h6>
                                <h3 className='text-[14px] font-[500] text-gray-600 leading-[20px] mt-2 text-[rgba(0,0,0,0.9)] transition-all'><Link to="/" className='link'>Description of the product goes here.</Link></h3>
                                <div className='flex items-center justify-between w-full p-2'>
                                    <p className='text-[18px] font-bold line-through'>$99.99</p>
                                    <p className='text-[18px] font-bold text-red-400'>$99.99</p>
                                </div>
                                <Button className='flex items-center justify-center !w-[90%] !border-[1.5px] !border-solid !border-red-400 !bg-inherit !text-red-400 !mx-auto gap-3 !my-4'><ShoppingCartCheckoutIcon /> ADD TO CART</Button>
                            </div>
                        </div>
                    </SwiperSlide>


                    <SwiperSlide>
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-400 shadow-md rounded-md flex flex-col items-center relative overflow-hidden'>
                            <div className='bg-white w-full flex items-center justify-center border-1 border-gray-200 relative group'>
                                <Link to="/productdetails/1" className='w-full h-[200px] relative overflow-hidden'>
                                    <img src="https://serviceapi.spicezgold.com/download/1742463096955_hbhb1.jpg" className='w-full opacity-100 hover:opacity-0 transition duration-500' />
                                    <img src="https://serviceapi.spicezgold.com/download/1742463096956_hbhb2.jpg" className='w-full absolute top-[0px] left-[0px] opacity-0  group-hover:scale-105 group-hover:opacity-100 group-hover:z-50 transition duration-500' />
                                </Link>
                                <div className='bg-red-400 rounded-md absolute left-[10px] top-[10px] text-[14px] px-2 py-1 z-50'>10%</div>
                                <div className="absolute right-[10px] -top-[100%] flex flex-col gap-[5px] p-1 transition-all z-50 duration-400 group-hover:top-[10px]">
                                    <div className='h-[35px] w-[35px] rounded-full bg-white dark:bg-gray-800 dark:text-gray-200 flex items-center justify-center dark:hover:bg-red-500 hover:text-white transition-all cursor-pointer'><IoExpand /></div>
                                    <div className='h-[35px] w-[35px] rounded-full bg-white dark:bg-gray-800 dark:text-gray-200 flex items-center justify-center dark:hover:bg-red-500 hover:text-white transition-all cursor-pointer'><FaRegHeart /></div>
                                    <div className='h-[35px] w-[35px] rounded-full bg-white dark:bg-gray-800 dark:text-gray-200 flex items-center justify-center dark:hover:bg-red-500 hover:text-white transition-all cursor-pointer'><FaRegHeart /></div>
                                </div>
                            </div>

                            <div className='info flex flex-col itms-center hustify-center w-full p-3'>
                                <h6 className='text-[13px] font-[500] capitalize mt-2'><Link to="/" className='link'>Product Name</Link></h6>
                                <h3 className='text-[14px] font-[200] text-gray-600 leading-[20px] mt-2 text-[rgba(0,0,0,0.9)] transition-all'><Link to="/" className='link text-gray-300'>Description of the product goes here.</Link></h3>
                                <div className='flex items-center justify-between w-full py-2'>
                                    <p className='text-[16px] font-medium line-through text-gray-200'>$99.99</p>
                                    <p className='text-[16px] font-bold text-red-400'>$99.99</p>
                                </div>
                                <Button className='flex items-center justify-center !w-[90%] !border-[1.5px] !border-solid !border-red-400 !bg-inherit !text-red-400 !mx-auto gap-3 !my-4'><ShoppingCartCheckoutIcon /> ADD TO CART</Button>
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-400 shadow-md rounded-md flex flex-col items-center relative overflow-hidden'>
                            <div className='bg-white w-full flex items-center justify-center border-1 border-gray-200 relative group'>
                                <Link to="/productdetails/1" className='w-full h-[200px] relative overflow-hidden'>
                                    <img src="https://serviceapi.spicezgold.com/download/1742463096955_hbhb1.jpg" className='w-full opacity-100 hover:opacity-0 transition duration-500' />
                                    <img src="https://serviceapi.spicezgold.com/download/1742463096956_hbhb2.jpg" className='w-full absolute top-[0px] left-[0px] opacity-0  group-hover:scale-105 group-hover:opacity-100 group-hover:z-50 transition duration-500' />
                                </Link>
                                <div className='bg-red-400 rounded-md absolute left-[10px] top-[10px] text-[14px] px-2 py-1 z-50'>10%</div>
                                <div className="absolute right-[10px] -top-[100%] flex flex-col gap-[5px] p-1 transition-all z-50 duration-400 group-hover:top-[10px]">
                                    <div className='h-[35px] w-[35px] rounded-full bg-white dark:bg-gray-800 dark:text-gray-200 flex items-center justify-center dark:hover:bg-red-500 hover:text-white transition-all cursor-pointer'><IoExpand /></div>
                                    <div className='h-[35px] w-[35px] rounded-full bg-white dark:bg-gray-800 dark:text-gray-200 flex items-center justify-center dark:hover:bg-red-500 hover:text-white transition-all cursor-pointer'><FaRegHeart /></div>
                                    <div className='h-[35px] w-[35px] rounded-full bg-white dark:bg-gray-800 dark:text-gray-200 flex items-center justify-center dark:hover:bg-red-500 hover:text-white transition-all cursor-pointer'><FaRegHeart /></div>
                                </div>
                            </div>

                            <div className='info flex flex-col itms-center hustify-center w-full p-3'>
                                <h6 className='text-[13px] font-[500] capitalize mt-2'><Link to="/" className='link'>Product Name</Link></h6>
                                <h3 className='text-[14px] font-[200] text-gray-600 leading-[20px] mt-2 text-[rgba(0,0,0,0.9)] transition-all'><Link to="/" className='link text-gray-300'>Description of the product goes here.</Link></h3>
                                <div className='flex items-center justify-between w-full py-2'>
                                    <p className='text-[16px] font-medium line-through text-gray-200'>$99.99</p>
                                    <p className='text-[16px] font-bold text-red-400'>$99.99</p>
                                </div>
                                <Button className='flex items-center justify-center !w-[90%] !border-[1.5px] !border-solid !border-red-400 !bg-inherit !text-red-400 !mx-auto gap-3 !my-4'><ShoppingCartCheckoutIcon /> ADD TO CART</Button>
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-400 shadow-md rounded-md flex flex-col items-center relative overflow-hidden'>
                            <div className='bg-white w-full flex items-center justify-center border-1 border-gray-200 relative group'>
                                <Link to="/productdetails/1" className='w-full h-[200px] relative overflow-hidden'>
                                    <img src="https://serviceapi.spicezgold.com/download/1742463096955_hbhb1.jpg" className='w-full opacity-100 hover:opacity-0 transition duration-500' />
                                    <img src="https://serviceapi.spicezgold.com/download/1742463096956_hbhb2.jpg" className='w-full absolute top-[0px] left-[0px] opacity-0  group-hover:scale-105 group-hover:opacity-100 group-hover:z-50 transition duration-500' />
                                </Link>
                                <div className='bg-red-400 rounded-md absolute left-[10px] top-[10px] text-[14px] px-2 py-1 z-50'>10%</div>
                                <div className="absolute right-[10px] -top-[100%] flex flex-col gap-[5px] p-1 transition-all z-50 duration-400 group-hover:top-[10px]">
                                    <div className='h-[35px] w-[35px] rounded-full bg-white dark:bg-gray-800 dark:text-gray-200 flex items-center justify-center dark:hover:bg-red-500 hover:text-white transition-all cursor-pointer'><IoExpand /></div>
                                    <div className='h-[35px] w-[35px] rounded-full bg-white dark:bg-gray-800 dark:text-gray-200 flex items-center justify-center dark:hover:bg-red-500 hover:text-white transition-all cursor-pointer'><FaRegHeart /></div>
                                    <div className='h-[35px] w-[35px] rounded-full bg-white dark:bg-gray-800 dark:text-gray-200 flex items-center justify-center dark:hover:bg-red-500 hover:text-white transition-all cursor-pointer'><FaRegHeart /></div>
                                </div>
                            </div>

                            <div className='info flex flex-col itms-center hustify-center w-full p-3'>
                                <h6 className='text-[13px] font-[500] capitalize mt-2'><Link to="/" className='link'>Product Name</Link></h6>
                                <h3 className='text-[14px] font-[200] text-gray-600 leading-[20px] mt-2 text-[rgba(0,0,0,0.9)] transition-all'><Link to="/" className='link text-gray-300'>Description of the product goes here.</Link></h3>
                                <div className='flex items-center justify-between w-full py-2'>
                                    <p className='text-[16px] font-medium line-through text-gray-200'>$99.99</p>
                                    <p className='text-[16px] font-bold text-red-400'>$99.99</p>
                                </div>
                                <Button className='flex items-center justify-center !w-[90%] !border-[1.5px] !border-solid !border-red-400 !bg-inherit !text-red-400 !mx-auto gap-3 !my-4'><ShoppingCartCheckoutIcon /> ADD TO CART</Button>
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-400 shadow-md rounded-md flex flex-col items-center relative overflow-hidden'>
                            <div className='bg-white w-full flex items-center justify-center border-1 border-gray-200 relative group'>
                                <Link to="/productdetails/1" className='w-full h-[200px] relative overflow-hidden'>
                                    <img src="https://serviceapi.spicezgold.com/download/1742463096955_hbhb1.jpg" className='w-full opacity-100 hover:opacity-0 transition duration-500' />
                                    <img src="https://serviceapi.spicezgold.com/download/1742463096956_hbhb2.jpg" className='w-full absolute top-[0px] left-[0px] opacity-0  group-hover:scale-105 group-hover:opacity-100 group-hover:z-50 transition duration-500' />
                                </Link>
                                <div className='bg-red-400 rounded-md absolute left-[10px] top-[10px] text-[14px] px-2 py-1 z-50'>10%</div>
                                <div className="absolute right-[10px] -top-[100%] flex flex-col gap-[5px] p-1 transition-all z-50 duration-400 group-hover:top-[10px]">
                                    <div className='h-[35px] w-[35px] rounded-full bg-white dark:bg-gray-800 dark:text-gray-200 flex items-center justify-center dark:hover:bg-red-500 hover:text-white transition-all cursor-pointer'><IoExpand /></div>
                                    <div className='h-[35px] w-[35px] rounded-full bg-white dark:bg-gray-800 dark:text-gray-200 flex items-center justify-center dark:hover:bg-red-500 hover:text-white transition-all cursor-pointer'><FaRegHeart /></div>
                                    <div className='h-[35px] w-[35px] rounded-full bg-white dark:bg-gray-800 dark:text-gray-200 flex items-center justify-center dark:hover:bg-red-500 hover:text-white transition-all cursor-pointer'><FaRegHeart /></div>
                                </div>
                            </div>

                            <div className='info flex flex-col itms-center hustify-center w-full p-3'>
                                <h6 className='text-[13px] font-[500] capitalize mt-2'><Link to="/" className='link'>Product Name</Link></h6>
                                <h3 className='text-[14px] font-[200] text-gray-600 leading-[20px] mt-2 text-[rgba(0,0,0,0.9)] transition-all'><Link to="/" className='link text-gray-300'>Description of the product goes here.</Link></h3>
                                <div className='flex items-center justify-between w-full py-2'>
                                    <p className='text-[16px] font-medium line-through text-gray-200'>$99.99</p>
                                    <p className='text-[16px] font-bold text-red-400'>$99.99</p>
                                </div>
                                <Button className='flex items-center justify-center !w-[90%] !border-[1.5px] !border-solid !border-red-400 !bg-inherit !text-red-400 !mx-auto gap-3 !my-4'><ShoppingCartCheckoutIcon /> ADD TO CART</Button>
                            </div>
                        </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-400 shadow-md rounded-md flex flex-col items-center relative overflow-hidden'>
                            <div className='bg-white w-full flex items-center justify-center border-1 border-gray-200 relative group'>
                                <Link to="/productdetails/1" className='w-full h-[200px] relative overflow-hidden'>
                                    <img src="https://serviceapi.spicezgold.com/download/1742463096955_hbhb1.jpg" className='w-full opacity-100 hover:opacity-0 transition duration-500' />
                                    <img src="https://serviceapi.spicezgold.com/download/1742463096956_hbhb2.jpg" className='w-full absolute top-[0px] left-[0px] opacity-0  group-hover:scale-105 group-hover:opacity-100 group-hover:z-50 transition duration-500' />
                                </Link>
                                <div className='bg-red-400 rounded-md absolute left-[10px] top-[10px] text-[14px] px-2 py-1 z-50'>10%</div>
                                <div className="absolute right-[10px] -top-[100%] flex flex-col gap-[5px] p-1 transition-all z-50 duration-400 group-hover:top-[10px]">
                                    <div className='h-[35px] w-[35px] rounded-full bg-white dark:bg-gray-800 dark:text-gray-200 flex items-center justify-center dark:hover:bg-red-500 hover:text-white transition-all cursor-pointer'><IoExpand /></div>
                                    <div className='h-[35px] w-[35px] rounded-full bg-white dark:bg-gray-800 dark:text-gray-200 flex items-center justify-center dark:hover:bg-red-500 hover:text-white transition-all cursor-pointer'><FaRegHeart /></div>
                                    <div className='h-[35px] w-[35px] rounded-full bg-white dark:bg-gray-800 dark:text-gray-200 flex items-center justify-center dark:hover:bg-red-500 hover:text-white transition-all cursor-pointer'><FaRegHeart /></div>
                                </div>
                            </div>

                            <div className='info flex flex-col itms-center hustify-center w-full p-3'>
                                <h6 className='text-[13px] font-[500] capitalize mt-2'><Link to="/" className='link'>Product Name</Link></h6>
                                <h3 className='text-[14px] font-[200] text-gray-600 leading-[20px] mt-2 text-[rgba(0,0,0,0.9)] transition-all'><Link to="/" className='link text-gray-300'>Description of the product goes here.</Link></h3>
                                <div className='flex items-center justify-between w-full py-2'>
                                    <p className='text-[16px] font-medium line-through text-gray-200'>$99.99</p>
                                    <p className='text-[16px] font-bold text-red-400'>$99.99</p>
                                </div>
                                <Button className='flex items-center justify-center !w-[90%] !border-[1.5px] !border-solid !border-red-400 !bg-inherit !text-red-400 !mx-auto gap-3 !my-4'><ShoppingCartCheckoutIcon /> ADD TO CART</Button>
                            </div>
                        </div>
                    </SwiperSlide>


                </Swiper>
            </div>
        </div>
    )
}

export default ProductsSlider
