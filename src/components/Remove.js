import axios from "axios";
import { Button } from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { toastInfo, updateToast, toastError } from "./Notification";

const RemoveFile = ({ hash, contract, owner, account }) => {
    const removeFile = async (e) => {
        e.preventDefault();

        if (owner.toLowerCase() !== account.toLowerCase()) {
            toastError("Anda bukan pemilik file ini dan tidak dapat menghapusnya.");
            return;
        }

        let toastId = null;
        try {
            toastId = toastInfo("Memproses penghapusan di blockchain...");
            const tx = await contract.remove(hash);
            await tx.wait();

            updateToast(toastId, "Data dihapus dari blockchain. Menghapus file dari IPFS...", "info");

            const pinataJwt = process.env.REACT_APP_PINATA_JWT;
            const apiURL = `https://api.pinata.cloud/pinning/unpin/${hash}`;

            await axios.delete(apiURL, {
                headers: {
                    Authorization: `Bearer ${pinataJwt}`,
                },
            });

            updateToast(toastId, "File berhasil dihapus sepenuhnya!", "success");
        } catch (error) {
            console.error(error);
            const errorMessage = error.reason || "Proses penghapusan gagal.";
            if (toastId) {
                updateToast(toastId, errorMessage, "error");
            } else {
                toastError(errorMessage);
            }
        }
    };

    if (owner.toLowerCase() !== account.toLowerCase()) {
        return null;
    }

    return (
        <Button
            variant="contained"
            color="error"
            size="small"
            onClick={removeFile}
            startIcon={<DeleteOutlineIcon />}
        >
            Hapus
        </Button>
    );
};

export default RemoveFile;
