// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

contract ArsipDokumen {
    struct File {
        uint fileId;
        string fileName;
        uint fileSize;
        string fileType;
        uint uploadTime;
        string fileHash;
        address owner;
        bool isActive;
    }

    mapping(address => File[]) private filesByOwner;
    mapping(address => mapping(string => uint)) private fileIndexByHash;
    mapping(address => mapping(address => bool)) public accessControl;
    uint public fileCounter;

    event FileUploaded(address indexed owner, uint fileId, string fileName, string fileHash, uint timestamp);
    event FileRemoved(address indexed owner, string fileHash, uint timestamp);
    event AccessGranted(address indexed owner, address indexed user, uint timestamp);
    event AccessRevoked(address indexed owner, address indexed user, uint timestamp);

    function add(
        string memory _fileName,
        uint _fileSize,
        string memory _fileType,
        string memory _fileHash
    ) external {
        uint storedIndex = fileIndexByHash[msg.sender][_fileHash];
        if (storedIndex > 0) {
            require(!filesByOwner[msg.sender][storedIndex - 1].isActive, "File dengan hash ini sudah ada dan aktif.");
        }

        fileCounter++;
        uint newIndex = filesByOwner[msg.sender].length;

        filesByOwner[msg.sender].push(
            File(
                fileCounter,
                _fileName,
                _fileSize,
                _fileType,
                block.timestamp,
                _fileHash,
                msg.sender,
                true
            )
        );

        fileIndexByHash[msg.sender][_fileHash] = newIndex + 1;

        emit FileUploaded(msg.sender, fileCounter, _fileName, _fileHash, block.timestamp);
    }

    function remove(string memory _fileHash) external {
        uint storedIndex = fileIndexByHash[msg.sender][_fileHash];
        require(storedIndex > 0, "File tidak ditemukan atau Anda bukan pemilik.");

        uint actualIndex = storedIndex - 1;
        File storage file = filesByOwner[msg.sender][actualIndex];
        require(file.isActive, "File ini sudah dihapus sebelumnya.");

        file.isActive = false;

        emit FileRemoved(msg.sender, _fileHash, block.timestamp);
    }

    function grantAccess(address _user) external {
        require(_user != msg.sender, "Tidak bisa memberikan akses ke diri sendiri.");
        accessControl[msg.sender][_user] = true;
        emit AccessGranted(msg.sender, _user, block.timestamp);
    }

    function revokeAccess(address _user) external {
        require(_user != msg.sender, "Tidak bisa memberikan akses ke diri sendiri.");
        accessControl[msg.sender][_user] = false;
        emit AccessRevoked(msg.sender, _user, block.timestamp);
    }

    function display(address _owner) external view returns (File[] memory) {
        require(_owner == msg.sender || accessControl[_owner][msg.sender], "Anda tidak memiliki akses.");
        File[] memory allFiles = filesByOwner[_owner];
        uint activeCount = 0;
        for (uint i = 0; i < allFiles.length; i++) {
            if (allFiles[i].isActive) {
                activeCount++;
            }
        }
        File[] memory activeFiles = new File[](activeCount);
        uint currentIndex = 0;
        for (uint i = 0; i < allFiles.length; i++) {
            if (allFiles[i].isActive) {
                activeFiles[currentIndex] = allFiles[i];
                currentIndex++;
            }
        }
        return activeFiles;
    }
}
