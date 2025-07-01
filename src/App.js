import { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
    Container,
    AppBar,
    Toolbar,
    Typography,
    Button,
    Stack,
    Paper,
} from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ArsipDokumenABI from "./artifacts/ArsipDokumen.json";
import FileUpload from "./components/Upload";
import Display from "./components/Display";
import ShareModal from "./components/Modal";
import customTheme from "./theme";
import "./App.css";

function App() {
    const [account, setAccount] = useState("");
    const [contract, setContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const loadProvider = async () => {
            if (window.ethereum) {
                const provider = new BrowserProvider(window.ethereum);

                window.ethereum.on("chainChanged", () => window.location.reload());
                window.ethereum.on("accountsChanged", () => window.location.reload());

                try {
                    await provider.send("eth_requestAccounts", []);
                    const signer = await provider.getSigner();
                    const address = await signer.getAddress();
                    setAccount(address);

                    let contractAddress = "0x29832b5064c00dcd190d61f5874865a8e68ab75f";
                    const contractInstance = new Contract(contractAddress, ArsipDokumenABI.abi, signer);

                    setContract(contractInstance);
                    setProvider(provider);
                } catch (error) {
                    console.error("User denied account access or other error:", error);
                }
            } else {
                console.error("Metamask is not installed");
            }
        };
        loadProvider();
    }, []);

    return (
        <ThemeProvider theme={customTheme}>
            <CssBaseline />
            <ToastContainer />

            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Arsip Dokumen RT 02
                    </Typography>
                    <Button
                        color="inherit"
                        variant="outlined"
                        onClick={() => setModalOpen(true)}
                        disabled={!account}
                    >
                        Bagikan Akses
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Stack spacing={4}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Informasi Akun
                        </Typography>
                        <Typography
                            variant="body2"
                            color={account ? "text.secondary" : "error"}
                            sx={{ wordBreak: 'break-all' }}
                        >
                            {account ? `Terhubung sebagai: ${account}` : "Metamask belum terhubung"}
                        </Typography>
                    </Paper>

                    <ShareModal
                        isOpen={modalOpen}
                        onClose={() => setModalOpen(false)}
                        contract={contract}
                        account={account}
                    />

                    <FileUpload account={account} provider={provider} contract={contract} />

                    <Display contract={contract} account={account} />
                </Stack>
            </Container>
        </ThemeProvider>
    );
}

export default App;
