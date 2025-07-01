import { toast } from 'react-toastify';

export const toastSuccess = (message) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
};

export const toastError = (message) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
};

export const toastInfo = (message) => {
    return toast.info(message, {
        position: "top-left",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
};

export const updateToast = (toastId, message, type) => {
    toast.update(toastId, {
        render: message,
        type: type,
        autoClose: 3000,
        closeOnClick: true,
        hideProgressBar: false,
        isLoading: false,
    });
};
