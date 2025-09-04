import { FaRegUser } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { Button, TextField } from "@mui/material";
import { IoBagCheckOutline, IoLocationOutline } from 'react-icons/io5';

const MyAccount = () => {
    return (
        <div className='p-5 flex gap-4 w-[95%] items-start'>
            {/* part 1 */}
            <section className='w-[18%] min-w-56 shadow-md border'>
                <div className="bg-white flex flex-col items-center p-5">
                    <div className="relative w-28 h-28 rounded-full overflow-hidden border border-red-400 border-dotted mb-2">
                        <img src="https://tse3.mm.bing.net/th/id/OIP.EwG6x9w6RngqsKrPJYxULAHaHa?pid=Api&P=0&h=180" className=' ' />
                        <div className='w-28 h-14  bg-gray-50 absolute bg-opacity-90 bottom-0 text-sm text-center pt-2'>
                            Upload photo
                        </div>
                    </div>

                    <h3 className='text-[16px]'>Jhon Doe</h3>
                    <h6 className='text-[14px]'>johndoe@gmail.com</h6>
                </div>
                <div>
                    <ul className="bg-gray-200 flex gap-1 flex-col py-2 pl-4 transition-all ease-in-out">
                        <li className="flex gap-2 items-center hover:bg-gray-100 p-2 rounded-sm"><FaRegUser /><span>My Profile</span></li>
                        <li className="flex gap-2 items-center hover:bg-gray-100 p-2 rounded-sm"><FaRegHeart /><span>My List</span></li>
                        <li className="flex gap-2 items-center hover:bg-gray-100 p-2 rounded-sm"><IoBagCheckOutline /><span>My Orders</span></li>
                        <li className="flex gap-2 items-center hover:bg-gray-100 p-2 rounded-sm"><IoLocationOutline /><span>My Address</span></li>
                        <li className="flex gap-2 items-center hover:bg-gray-100 p-2 rounded-sm"><FiLogOut /><span>Logout</span></li>
                    </ul>
                </div>
            </section>

            {/* part 2 */}
            <section className='w-[65%] shadow-md border p-4 bg-white'>
                <h1>My Profile</h1>
                <hr className="my-5" />
                <div>
                    <TextField />
                    <TextField />
                    <TextField />
                </div>
                <div className="flex gap-4 ">
                    <Button variant="contained" className="!rounded-none !bg-red-400">Save</Button>
                    <Button variant="outlined" className="!rounded-none">cancel</Button>
                </div>
            </section>
        </div>
    )
}

export default MyAccount
