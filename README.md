# Arsip Dokumen RT Terdesentralisasi

Proyek ini adalah sebuah **Aplikasi Terdesentralisasi (dApp)** yang dibangun untuk mengatasi masalah pengarsipan dokumen di lingkungan Rukun Tetangga (RT). Dengan memanfaatkan teknologi blockchain, aplikasi ini bertujuan untuk menciptakan sistem arsip yang aman, transparan, tidak dapat diubah, dan mudah diakses oleh pihak yang berwenang, menggantikan metode konvensional yang rawan kehilangan dan kerusakan data.

## 🚀 Fitur Utama

-   **Unggah Aman**: Unggah dokumen ke sistem penyimpanan terdesentralisasi (IPFS) melalui Pinata dan catat *hash* uniknya di *blockchain*.
-   **Kepemilikan Terverifikasi**: Setiap arsip terikat pada alamat Ethereum pemiliknya, memastikan hanya pemilik yang dapat mengelola arsip tersebut.
-   **Kontrol Akses**: Pemilik arsip dapat dengan mudah memberikan dan mencabut hak akses lihat kepada alamat Ethereum lainnya.
-   **Tampilan Data Dinamis**: Menampilkan daftar arsip dari alamat mana pun (selama memiliki hak akses).
-   **Pencarian Cepat**: Fitur pencarian instan untuk menyaring dan menemukan dokumen berdasarkan nama file.
-   **Antarmuka Modern & Responsif**: Dibangun dengan *framework* UI MUI (Material-UI) untuk pengalaman pengguna yang optimal di semua perangkat.
-   **Notifikasi *Real-time***: Memberikan umpan balik kepada pengguna untuk setiap aksi (unggah, hapus, berbagi) menggunakan notifikasi *toast*.

## 🛠️ Tumpukan Teknologi

-   **Frontend**:
    -   [React.js](https://reactjs.org/) - Library utama untuk membangun antarmuka pengguna.
    -   [MUI (Material-UI)](https://mui.com/) - *Framework* komponen UI untuk desain yang bersih dan responsif.
    -   [Ethers.js](https://ethers.io/) - Library untuk berinteraksi dengan *blockchain* Ethereum.
    -   [Axios](https://axios-http.com/) - Untuk melakukan permintaan HTTP ke Pinata.
    -   [React Toastify](https://fkhadra.github.io/react-toastify/introduction) - Untuk menampilkan notifikasi.

-   **Backend & Blockchain**:
    -   [Solidity](https://soliditylang.org/) - Bahasa pemrograman untuk menulis *smart contract*.
    -   [Ethereum](https://ethereum.org/) - *Blockchain* tempat *smart contract* di-*deploy* (misalnya Jaringan Tes Sepolia).
    -   [Remix](https://remix.ethereum.org/) - Lingkungan pengembangan untuk kompilasi dan *deployment*.

-   **Penyimpanan**:
    -   [IPFS](https://ipfs.tech/) - Protokol penyimpanan file *peer-to-peer*.
    -   [Pinata](https://pinata.cloud/) - Layanan *pinning* untuk memastikan file tetap ada di IPFS.

## ⚙️ Memulai Proyek

Untuk menjalankan proyek ini di lingkungan lokal Anda, ikuti langkah-langkah berikut:

**1. Klon Repositori**
```bash
git clone https://github.com/HIUNCY/dApp-file-sharing
cd dApp-file-sharing
```

**2. Install Dependensi**
Proyek ini menggunakan npm sebagai manajer paket. Jalankan perintah berikut untuk menginstal semua library yang dibutuhkan.
```bash
npm install
```

**3. Siapkan File Environment**
Salin file `.env.example` menjadi `.env`.
```sh
cp .env.example .env
```
Buka file `.env` dan sesuaikan nilainya dengan konfigurasi semua key yang bersifat rahasia.
```env
REACT_APP_PINATA_API_KEY="KEY_API_PINATA_ANDA"
REACT_APP_PINATA_SECRET_API_KEY="SECRET_KEY_PINATA_ANDA"
REACT_APP_PINATA_JWT="TOKEN_JWT_PINATA_ANDA"
```

**4. Konfigurasi Smart Contract**
- Deploy smart contract ArsipDokumen.sol ke jaringan tes (misalnya Sepolia).
- Buka file `src/App.js` dan perbarui variabel contractAddress dengan alamat kontrak yang baru Anda deploy.
- Pastikan file ABI (`ArsipDokumen.json`) yang ada di dalam `src/artifacts/` adalah ABI dari kontrak yang baru Anda kompilasi.

**5. Jalankan Aplikasi**
Setelah semua langkah di atas selesai, jalankan perintah berikut untuk memulai aplikasi React.
```bash
npm start
```
Aplikasi akan terbuka secara otomatis di browser Anda pada alamat `http://localhost:3000`. Pastikan Anda memiliki extension browser Metamask dan terhubung ke jaringan yang sama dengan tempat Anda men-deploy smart contract.
