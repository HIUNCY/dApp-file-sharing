import { useState } from "react";
import RemoveFile from "./Remove";
import {
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Link,
    CircularProgress,
    InputAdornment
} from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SearchIcon from '@mui/icons-material/Search';
import { toastError } from "./Notification";

const Display = ({ contract, account }) => {
    const [dataArray, setDataArray] = useState([]);
    const [loading, setLoading] = useState(false);
    const [otherAddress, setOtherAddress] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const getData = async () => {
        setLoading(true);
        setDataArray([]);

        try {
            const targetAddress = otherAddress || account;
            if (!targetAddress) {
                toastError("Alamat tidak valid atau Anda tidak terhubung.");
                setLoading(false);
                return;
            }

            const data = await contract.display(targetAddress);

            if (data.length === 0) {
                toastError("Tidak ada file untuk ditampilkan dari alamat ini.");
            }
            setDataArray(data);

        } catch (e) {
            console.error(e);
            toastError("Anda tidak memiliki akses ke data alamat ini.");
        } finally {
            setLoading(false);
        }
    };

    const filteredData = dataArray.filter((item) =>
        item.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Paper elevation={2} sx={{ p: 3 }}>
            <Stack spacing={3}>
                <Typography variant="h6">Lihat Arsip Dokumen</Typography>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                        label="Masukkan Alamat Wallet Lain (Opsional)"
                        variant="outlined"
                        size="small"
                        disabled={!account || !contract}
                        fullWidth
                        value={otherAddress}
                        onChange={(e) => setOtherAddress(e.target.value)}
                    />
                    <Button
                        onClick={getData}
                        variant="contained"
                        disabled={!account || loading || !contract}
                        sx={{ whiteSpace: 'nowrap' }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Tampilkan File"}
                    </Button>
                </Stack>

                {/* Input untuk pencarian */}
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Cari berdasarkan nama file..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={dataArray.length === 0}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                <TableContainer>
                    <Table size="small">
                        <TableHead sx={{ backgroundColor: 'grey.200' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Nama File</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Tipe File</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Waktu Unggah</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Pemilik</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Tindakan</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <TableRow key={item.fileHash} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            {item.fileName}
                                        </TableCell>
                                        <TableCell>{item.fileType}</TableCell>
                                        <TableCell>{new Date(Number(item.uploadTime) * 1000).toLocaleString()}</TableCell>
                                        <TableCell>{`${item.owner.substring(0, 6)}...${item.owner.substring(38)}`}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<OpenInNewIcon />}
                                                    href={`https://gateway.pinata.cloud/ipfs/${item.fileHash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    component={Link}
                                                >
                                                    Buka
                                                </Button>
                                                <RemoveFile hash={item.fileHash} contract={contract} owner={item.owner} account={account} />
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                        <Typography color="text.secondary">
                                            {dataArray.length > 0 ? "Tidak ada hasil yang cocok." : "Tidak ada data untuk ditampilkan."}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Stack>
        </Paper>
    );
};

export default Display;
