contract_abi = [
  //secret
]


document.addEventListener("DOMContentLoaded", function() {
  if (typeof window.ethereum === 'undefined') {
    alert("Please install MetaMask to use this feature.");
    return;
  }

  const connectButton = document.getElementById("connectButton");
  const uploadButton = document.getElementById("uploadButton");
  const deleteButton = document.getElementById("deleteButton");
  const transferButton = document.getElementById("transferButton");
  const transferHistoryButton = document.getElementById("transferHistoryButton");
  const DetailsButton = document.getElementById("DetailsButton");
  const contractAddress="0xfD730e72f5040886a9E25c18Fd8B371a07b6D5fE";
  let web3 = new Web3(ethereum);
  const contract = new web3.eth.Contract(contract_abi, contractAddress);
  let selectedAccount;
  

  async function connectToMetaMask() {
    try {
      await ethereum.request({ method: 'eth_requestAccounts' });
      // Instantiate the contract
      selectedAccount = await web3.eth.getCoinbase();
      alert(`Connected to MetaMask!\nAccount: ${selectedAccount}`);

      // Enable the upload button
      uploadButton.disabled = false;
      deleteButton.disabled = false;
      transferButton.disabled = false;
      transferHistoryButton.disabled = false;
      DetailsButton.disabled = false;
    } catch (error) {
      console.error(error);
      alert("Failed to connect to MetaMask.");
    }
  }

  function handleUploadApartment(event) {
    event.preventDefault(); // Prevent the default form submission

    const size = document.getElementById("size").value;
    const price = document.getElementById("price").value;
    const location = document.getElementById("location").value;
    const imageHash = document.getElementById("imageHash").value;
    // Perform the transaction using the retrieved form inputs
    web3.eth.sendTransaction({
      from: selectedAccount,
      to: contractAddress,
      data: contract.methods.uploadApartment(size, price, location, imageHash).encodeABI()
    }).on("transactionHash", function(hash) {
      console.log("Transaction hash:", hash);
    }).on("receipt", function(receipt) {
      console.log("Transaction receipt:", receipt);
      alert("Apartment uploaded successfully.");
    }).on("error", function(error) {
      console.error("Error:", error);
      alert("Failed to upload apartment.");
    });
  }

  function handleDeleteApartment(event) {
    event.preventDefault();
    // Perform the transaction using the retrieved form inputs
    web3.eth.sendTransaction({
      from: selectedAccount,
      to: contractAddress,
      data: contract.methods.deleteApartment().encodeABI()
    }).on("transactionHash", function(hash) {
      console.log("Transaction hash:", hash);
    }).on("receipt", function(receipt) {
      console.log("Transaction receipt:", receipt);
      alert("Apartment deleted successfully.");
    }).on("error", function(error) {
      console.error("Error:", error);
      alert("Failed to delete apartment.");
    });
  }


  function handleTransferApartment(event) {
    event.preventDefault();

    const transfer_address = document.getElementById("Transfer").value;
    console.log(transfer_address);
    const transferAddress = web3.utils.toChecksumAddress(transfer_address);

    if (!web3.utils.isAddress(transferAddress)) {
      alert("Invalid transfer address. Please enter a valid Ethereum address.");
      return;
    }

    // Perform the transaction using the retrieved form inputs
    web3.eth.sendTransaction({
      from: selectedAccount,
      to: contractAddress,
      data: contract.methods.transferApartment(transferAddress).encodeABI()
    }).on("transactionHash", function(hash) {
      console.log("Transaction hash:", hash);
    }).on("receipt", function(receipt) {
      console.log("Transaction receipt:", receipt);
      alert("Apartment transfered successfully.");
    }).on("error", function(error) {
      console.error("Error:", error);
      alert("Failed to transfer apartment.");
    });

  }

  function handleHistoryTransfers(event) {
    event.preventDefault();
  
    contract.methods
      .getTransferHistory()
      .call({ from: selectedAccount })
      .then(function (result) {
        let transferList = result.map(function (transfer, index) {
          let counter = index + 1;
          return counter + ") " + transfer.from + " ----> " + transfer.to;
        });
  
      // Prepare the data to be passed to the new page
      const transferData = {
        transferList,
      };

      const transferDataJson = JSON.stringify(transferData);
      const encodedData = encodeURIComponent(transferDataJson);
      // Update the URL path with the encoded data
      window.location.href = `/TransferHistory?data=${encodedData}`;
    })
    .catch(function (error) {
      console.error("Error:", error);
      alert("Failed to fetch transfer history.");
    });
  }
  


  function handleApartmentDetails(event) {
    event.preventDefault(); 
  
    const apartmentAddress = document.getElementById("ApartmentDetails").value;
    const apartmentAddressChecksum = web3.utils.toChecksumAddress(apartmentAddress);
  
    if (!web3.utils.isAddress(apartmentAddressChecksum)) {
      alert("Invalid apartment address. Please enter a valid Ethereum address.");
      return;
    }
  
    contract.methods
    .getApartmentDetails(apartmentAddressChecksum)
    .call({ from: selectedAccount })
    .then(function (result) {
      const size = result[0];
      const price = result[1];
      const location = result[2];
      const imageHash = result[3];

      // Prepare the data to be passed to the new page
      const detailsData = {
        size,
        price,
        location,
        imageHash,
      };

      const detailsDataJson = JSON.stringify(detailsData);
      const encodedData = encodeURIComponent(detailsDataJson);
      // Redirect to the new page
      window.location.href = `/ApartmentDetails?data=${encodedData}`;
    })
    .catch(function (error) {
      console.error("Error:", error);
      alert("Failed to fetch apartment details.");
    });
}
  

  // add event listeners for buttons
  connectButton.addEventListener("click", connectToMetaMask);
  uploadButton.addEventListener("click", handleUploadApartment);
  deleteButton.addEventListener("click",handleDeleteApartment);
  transferButton.addEventListener("click",handleTransferApartment);
  transferHistoryButton.addEventListener("click",handleHistoryTransfers);
  DetailsButton.addEventListener("click",handleApartmentDetails)
});
