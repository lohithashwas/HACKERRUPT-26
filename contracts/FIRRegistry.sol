
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FIRRegistry {
    
    struct FIRRequest {
        string firId;
        string complainant;
        string officer;
        string incidentType;
        uint256 timestamp;
        string ipfsHash; // Optional: store PDF hash if we had IPFS
    }

    // Mapping from FIR ID to FIR Data
    mapping(string => FIRRequest) public firs;
    // Array to keep track of all FIR IDs
    string[] public firIds;

    event FIRRegistered(string indexed firId, string complainant, uint256 timestamp);

    function registerFIR(string memory _firId, string memory _complainant, string memory _officer, string memory _incidentType) public {
        // Ensure FIR ID doesn't already exist (simple check)
        // require(bytes(firs[_firId].firId).length == 0, "FIR ID already exists");

        firs[_firId] = FIRRequest({
            firId: _firId,
            complainant: _complainant,
            officer: _officer,
            incidentType: _incidentType,
            timestamp: block.timestamp,
            ipfsHash: ""
        });

        firIds.push(_firId);

        emit FIRRegistered(_firId, _complainant, block.timestamp);
    }

    function getFIR(string memory _firId) public view returns (string memory, string memory, string memory, string memory, uint256) {
        FIRRequest memory fir = firs[_firId];
        return (fir.firId, fir.complainant, fir.officer, fir.incidentType, fir.timestamp);
    }

    function getTotalFIRs() public view returns (uint256) {
        return firIds.length;
    }
}
