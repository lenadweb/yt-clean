import { Bounce, toast } from 'react-toastify';

export const notifyCopy = (value: number | string) => {
    toast.success(`Copied: ${value}`, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeButton: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Bounce,
    });
};
