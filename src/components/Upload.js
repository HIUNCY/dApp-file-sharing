import { useState } from "react";
import axios from "axios";
import { Button, Input, Paper, Stack, Typography } from "@mui/material";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { toastInfo, updateToast, toastError } from "./Notification";

const FileUpload = ({ contract, account }) => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("Tidak ada file yang dipilih");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toastError("Silakan pilih file terlebih dahulu!");
            return;
        }

        let toastId = null;

        try {
            toastId = toastInfo("Mengunggah file ke IPFS...");

            const formData = new FormData();
            formData.append("file", file);

            const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
            const pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET_API_KEY;

            const resFile = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                data: formData,
                headers: {
                    pinata_api_key: pinataApiKey,
                    pinata_secret_api_key: pinataSecretApiKey,
                    "Content-Type": "multipart/form-data",
                },
            });

            updateToast(toastId, "File diunggah ke IPFS. Menunggu konfirmasi transaksi...", "info");

            const ipfsHash = resFile.data.IpfsHash;
            const tx = await contract.add(file.name, file.size, file.type, ipfsHash);
            await tx.wait();

            updateToast(toastId, "File berhasil diarsipkan di blockchain!", "success");

            setFileName("Tidak ada file yang dipilih");
            setFile(null);

        } catch (error) {
            console.error(error);
            const errorMessage = error.reason || "Gagal mengunggah file. Silakan coba lagi.";
            if (toastId) {
                updateToast(toastId, errorMessage, "error");
            } else {
                toastError(errorMessage);
            }
        }
    };

    const retrieveFile = (e) => {
        const data = e.target.files[0];
        if (data) {
            setFile(data);
            setFileName(data.name);
        }
        e.preventDefault();
    };

    return (
        <Paper component="form" onSubmit={handleSubmit} elevation={2} sx={{ p: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h6">Unggah Arsip Baru</Typography>

                <Stack direction="row" spacing={2} alignItems="center">
                     <Button
                        variant="outlined"
                        component="label"
                        disabled={!account}
                        startIcon={<FileUploadOutlinedIcon />}
                    >
                        Pilih File
                        <Input
                            type="file"
                            hidden
                            onChange={retrieveFile}
                        />
                    </Button>
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {fileName}
                    </Typography>
                </Stack>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!file || !account}
                >
                    Upload
                </Button>
            </Stack>
        </Paper>
    );
};

export default FileUpload;
