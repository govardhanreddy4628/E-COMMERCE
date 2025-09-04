import { Toaster as HotToaster } from 'react-hot-toast';

const Toaster = () => {
    return (
        <HotToaster
            position="top-center"
            toastOptions={{
                duration: 5000,
                style: {
                    background: '#333',
                    color: '#fff',
                    transition: 'all 0.8s ease-in-out',
                },
                success: {
                    duration: 6000,
                    style: {
                        background: 'green',
                    },
                },
                error: {
                    duration: 7000,
                    style: {
                        background: 'crimson',
                    },
                },
            }}
        />
    )
}

export default Toaster
