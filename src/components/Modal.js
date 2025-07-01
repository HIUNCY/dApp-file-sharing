import { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
    Box
} from "@mui/material";
import { toastError, toastInfo, updateToast } from "./Notification";

const ShareModal = ({ isOpen, onClose, contract, account }) => {
    const [accessList, setAccessList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addressToShare, setAddressToShare] = useState("");
    const [addressToRevoke, setAddressToRevoke] = useState("");

    const grantAccess = async () => {
        if (!addressToShare) {
            toastError("Alamat tidak boleh kosong.");
            return;
        }
        let toastId = toastInfo("Memberikan akses...");
        try {
            const tx = await contract.grantAccess(addressToShare);
            await tx.wait();
            updateToast(toastId, "Akses berhasil dibagikan!", "success");
            onClose();
        } catch (e) {
            console.error(e);
            updateToast(toastId, e.reason || "Gagal memberikan akses.", "error");
        }
    };

    const revokeAccess = async () => {
        if (!addressToRevoke) {
            toastError("Pilih alamat yang akan dicabut aksesnya.");
            return;
        }
        let toastId = toastInfo("Mencabut akses...");
        try {
            const tx = await contract.revokeAccess(addressToRevoke);
            await tx.wait();
            updateToast(toastId, "Akses berhasil dicabut!", "success");
            onClose();
        } catch (e) {
            console.error(e);
            updateToast(toastId, e.reason || "Gagal mencabut akses.", "error");
        }
    };

    useEffect(() => {
        if (isOpen && contract && account) {
            setLoading(true);
            const getAccessList = async () => {
                try {
                    const filterGranted = contract.filters.AccessGranted(account, null);
                    const filterRevoked = contract.filters.AccessRevoked(account, null);

                    const pastGranted = await contract.queryFilter(filterGranted, 0, "latest");
                    const pastRevoked = await contract.queryFilter(filterRevoked, 0, "latest");

                    const accessMap = new Map();
                    for (const event of pastGranted) {
                        accessMap.set(event.args.user.toLowerCase(), true);
                    }
                    for (const event of pastRevoked) {
                        accessMap.set(event.args.user.toLowerCase(), false);
                    }

                    const finalAccessList = [];
                    for (const [address, hasAccess] of accessMap.entries()) {
                        if (hasAccess) {
                            finalAccessList.push(address);
                        }
                    }
                    setAccessList(finalAccessList);
                } catch (error) {
                    console.error("Gagal mengambil daftar akses:", error);
                    toastError("Gagal memuat daftar akses.");
                } finally {
                    setLoading(false);
                }
            };
            getAccessList();
        }
    }, [isOpen, contract, account]);

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Kelola Akses Berbagi</DialogTitle>
            <DialogContent>
                <Stack spacing={4} sx={{ mt: 2 }}>
                    <Box>
                        <Typography variant="subtitle1" gutterBottom>Bagikan Akses Baru</Typography>
                        <TextField
                            fullWidth
                            label="Masukkan Alamat Wallet"
                            variant="outlined"
                            value={addressToShare}
                            onChange={(e) => setAddressToShare(e.target.value)}
                        />
                        <Button onClick={grantAccess} variant="contained" sx={{ mt: 1 }} fullWidth>
                            Bagikan
                        </Button>
                    </Box>

                    <Box>
                        <Typography variant="subtitle1" gutterBottom>Cabut Akses</Typography>
                        <FormControl fullWidth>
                            <InputLabel id="revoke-access-label">Pilih Pengguna</InputLabel>
                            <Select
                                labelId="revoke-access-label"
                                value={addressToRevoke}
                                label="Pilih Pengguna"
                                onChange={(e) => setAddressToRevoke(e.target.value)}
                                disabled={loading || accessList.length === 0}
                            >
                                {loading ? (
                                    <MenuItem value="" disabled><CircularProgress size={20} /></MenuItem>
                                ) : (
                                    accessList.map((addr) => (
                                        <MenuItem key={addr} value={addr}>
                                            {addr}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>
                        <Button
                            onClick={revokeAccess}
                            variant="contained"
                            color="error"
                            sx={{ mt: 1 }}
                            fullWidth
                            disabled={!addressToRevoke}
                        >
                            Cabut Akses
                        </Button>
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Tutup</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShareModal;
