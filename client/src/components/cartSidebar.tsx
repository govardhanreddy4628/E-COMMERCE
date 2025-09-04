import { IoClose } from 'react-icons/io5'
import { RiDeleteBin5Line } from "react-icons/ri";

type CartSidebarProps = {
    setOpen: (open: boolean) => void;
};

const cartItems = new Array(10).fill({
    title: "A-Line Kurti With Sharara & Dupatta",
    image: "https://serviceapi.spicezgold.com/download/1742463096956_hbhb2.jpg",
    quantity: 2,
    price: 25
});

const CartSidebar = ({ setOpen }: CartSidebarProps) => {
    return (

        <div className="h-full max-h-screen flex flex-col bg-white dark:bg-gray-900 text-black dark:text-white">
            {/* Header */}
            <header className='sticky top-0 left-0 bg-white dark:bg-gray-900 flex items-center justify-between p-4 shadow z-10'>
                <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Shopping Cart <span className="text-sm font-normal">({cartItems.length})</span>
                </h1>
                <button onClick={() => setOpen(false)} className='text-gray-700 dark:text-gray-300 hover:text-red-500 transition'>
                    <IoClose size={25} />
                </button>
            </header>

            <hr />

            {/* Cart Items */}
            <div className="overflow-y-auto flex-1 pt-2 px-2 space-y-2">
                {cartItems.map((item, index) => (
                    <div key={index} className='flex justify-between items-start border-b pb-3 gap-3'>
                        {/* Image */}
                        <div className='w-16 h-16 overflow-hidden rounded-md border'>
                            <img src={item.image} alt={item.title} className='w-full h-full object-cover' />
                        </div>

                        {/* Info */}
                        <div className='flex-1'>
                            <p className='text-[15px] font-normal text-gray-600 dark:text-gray-200 mb-1 line-clamp-2'>{item.title}</p>
                            <div className='flex gap-4 text-sm text-gray-600 dark:text-gray-400'>
                                <span className='font-semibold'>Qty: {item.quantity}</span>
                                <span className='font-semibold text-red-500'>Price: ${item.price}</span>
                            </div>
                        </div>
                        <button className='text-gray-600 hover:text-red-600 transition mt-2'>
                            <RiDeleteBin5Line size={20} />
                        </button>
                    </div>

                ))}
            </div>

            {/* Checkout Footer */}
            <div className="p-4 border-t">
                <div className="flex justify-between text-lg font-semibold mb-4">
                    <span>Total</span>
                    <span>${cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}</span>
                </div>
                <button className='w-full py-3 text-center bg-red-500 text-white rounded hover:bg-red-600 transition font-medium'>
                    Proceed to Checkout
                </button>
            </div>
        </div>

    )
}

export default CartSidebar;



