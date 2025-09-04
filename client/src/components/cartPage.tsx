
import {BsFillBagCheckFill} from "react-icons/bs";
import { Button } from '@mui/material'
import CartItem from "./cartItem";


const CartPage = () => {
  
  return (
    <section className='py-5 max-w-[90%] mx-auto pb-10'>
      <div className='flex gap-5'>

        <div className='leftPart w-[70%]'>
            <div className='py-2 px-3 border-b border-[rgba(0,0,0,0.1)] bg-white'>
              <h2 className='font-bold'>Your Cart</h2>
              <p className='mt-0 text-gray-600'>
                There are  <span className='font-bold text-primary'>2</span> products
                in your cart
              </p>
            </div>
            <CartItem/>
            <CartItem/>
            <CartItem/>
        </div>

        <div className='right w-[30%] mr-auto'>
          <div className='shadow-md rounded-md bg-white p-5'> 
            <h3 className='pb-3'>Cart Total</h3>
            <hr/>
            <p className='flex flex-center justify-between'>
              <span className='text-[14px] font-[500]'>Subtotal</span>
              <span className='text-red-500 font-bold'> &#8377; 1,300.00</span>
            </p>
            <p className='flex flex-center justify-between'>
              <span className='text-[14px] font-[500]'>Shipping</span>
              <span className='font-bold'>Free</span>
            </p>
            <p className='flex flex-center justify-between'>
              <span className='text-[14px] font-[500]'>Estimate for</span>
              <span className='font-bold'>United Kingdom</span>
            </p>
            <p className='flex flex-center justify-between'>
              <span className='text-[14px] font-[500]'>Total</span>
              <span className='text-red-500 font-bold'>&#8377; 1,300.00</span>
            </p>
            <br/>
            <Button className='w-full text-[20px] flex items-center gap-2 !bg-red-500 !text-white'><BsFillBagCheckFill className="text-[20px] " /> Checkout </Button>
            
          </div>
          <div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default CartPage
