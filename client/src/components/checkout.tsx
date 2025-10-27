import { createOrderOnServer, verifyPaymentOnServer } from '../api/payments';




// client/src/api/payments.js
// import axios from 'axios';


// const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });


// export const createOrderOnServer = (payload) => API.post('/payments/create-order', payload);
// export const verifyPaymentOnServer = (payload) => API.post('/payments/verify-payment', payload);





const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (document.getElementById('razorpay-sdk')) return resolve(true);
        const script = document.createElement('script');
        script.id = 'razorpay-sdk';
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};


export default function Checkout({ cartItems }) {

    const handlePay = async (amount) => {

        // const { data: { key } } = await axios.get("http://www.localhost:4000/api/getkey")

        // const { data: { order } } = await axios.post("http://localhost:4000/api/checkout", {
        //     amount
        // })

        const loaded = await loadRazorpayScript();
        if (!loaded) return alert('Razorpay SDK failed to load');


        // 1. Create order on server
        const createResp = await createOrderOnServer({ items: cartItems, amount });
        const { razorpayOrder, orderId } = { razorpayOrder: createResp.data.razorpayOrder, orderId: createResp.data.orderId };


        const options = {
            key,
            amount: order.amount,
            currency: "INR",
            name: 'Go Store',
            description: 'Go Store Test Transaction',
            order_id: order.id,
            handler: async function (response) {
                // Send the payment response to server for verification
                try {
                    const verifyResp = await verifyPaymentOnServer({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        orderId: orderId,
                    });
                    alert('Payment successful and verified');
                    console.log('Order updated:', verifyResp.data.order);
                } catch (err) {
                    console.error('Verification error', err);
                    alert('Payment verification failed');
                }
            },
            prefill: {
                // optional
                name: 'govardhan',
                email: 'govardhan4628@gmail.com',
                contact: '9999999999',
            },
            theme: { color: '#3399cc' },
        };


        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
            console.error('Payment Failed', response.error);
            alert('Payment failed');
        });
        rzp.open();
    };


    return (
        <div>
            <h3>Checkout</h3>
            <div>Total: ₹{(totalAmount).toFixed(2)}</div>
            <button onClick={() => handlePay(amount)}>Pay with Razorpay</button>
        </div>
    );
}