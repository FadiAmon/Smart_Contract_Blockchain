pragma solidity ^0.8.0;
// SPDX-License-Identifier: MIT
contract ApartmentRegistry {
    struct Apartment {
        uint256 size;
        uint256 price;
        string location;
        string imageHash;  // Add a field to store the IPFS hash
    }


    struct Transfer {
        address from;
        address to;
    }

    mapping(address => Apartment) private apartments;
    Transfer[] private transferHistory;


    function uploadApartment(uint256 _size, uint256 _price, string memory _location, string memory _imageHash) public {
        Apartment storage newApartment = apartments[msg.sender];
        newApartment.size = _size;
        newApartment.price = _price;
        newApartment.location = _location;
        newApartment.imageHash = _imageHash;  // Store the IPFS hash
    }



    function transferApartment(address _to) public {
        require(msg.sender != _to, "Can't transfer apartment to yourself!");
        require(apartments[msg.sender].size > 0, "No apartment exists for the caller.");
        apartments[_to] = apartments[msg.sender];  // Copy the apartment object to the new address
        delete apartments[msg.sender];  // Delete the apartment object from the caller's address
        Transfer memory newTransfer = Transfer(msg.sender, _to);
        transferHistory.push(newTransfer);
}


    function getApartmentDetails(address _address) public view returns (uint256, uint256, string memory) {
        if (apartments[_address].size == 0) {
            return (0, 0, "");  // Return default values when apartment is not found
        }

        Apartment memory apartment = apartments[_address];  

        return (apartment.size, apartment.price, apartment.location);  
    }



function getTransferHistory() public view returns (Transfer[] memory) {
        return transferHistory;
}







    function deleteApartment() public {
        require(apartments[msg.sender].size > 0, "No apartment exists for the caller.");
        delete apartments[msg.sender];
}



}