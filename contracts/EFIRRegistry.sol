// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EFIRRegistry {
    struct FIRRecord {
        string firId;
        string dataHash;
        uint256 timestamp;
        address registrar;
    }

    mapping(string => FIRRecord) public firs;
    event FIRRegistered(string indexed firId, string dataHash, uint256 timestamp, address registrar);

    function registerFIR(string memory _firId, string memory _dataHash) public {
        require(bytes(firs[_firId].firId).length == 0, "FIR ID already exists");

        firs[_firId] = FIRRecord({
            firId: _firId,
            dataHash: _dataHash,
            timestamp: block.timestamp,
            registrar: msg.sender
        });

        emit FIRRegistered(_firId, _dataHash, block.timestamp, msg.sender);
    }

    function getFIR(string memory _firId) public view returns (string memory, string memory, uint256, address) {
        FIRRecord memory record = firs[_firId];
        return (record.firId, record.dataHash, record.timestamp, record.registrar);
    }
}
