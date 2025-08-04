document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("form").addEventListener("click", handler);
  document
    .getElementById("check_balance")
    .addEventListener("click", checkBalance);
});

function handler(event) {
  document.getElementById("center").style.display = "flex";

  const private_key = document.getElementById("private_key").value;
  const amount = document.getElementById("amount").value;
  const address = document.getElementById("address").value;

  // Validation
  if (!private_key || !amount || !address) {
    alert("Please fill in all fields");
    document.getElementById("center").style.display = "none";
    return;
  }

  // Basic address format validation
  if (!address.startsWith("0x") || address.length !== 42) {
    alert(
      "Please enter a valid Ethereum address (should start with 0x and be 42 characters long)"
    );
    document.getElementById("center").style.display = "none";
    return;
  }

  // Validate private key format
  if (!private_key.startsWith("0x") || private_key.length !== 66) {
    alert(
      "Please enter a valid private key (should start with 0x and be 66 characters long)"
    );
    document.getElementById("center").style.display = "none";
    return;
  }

  const provider = new ethers.JsonRpcProvider(
    "https://eth-sepolia.g.alchemy.com/v2/vEWDw8Bnbgz1IedM5nNzqQNKNAtA6gml"
  );

  let wallet = new ethers.Wallet(private_key, provider);

  const tx = {
    to: address,
    value: ethers.parseEther(amount), // Fixed: removed .utils
  };

  wallet
    .sendTransaction(tx)
    .then((txObj) => {
      console.log("TxHash", txObj.hash);
      document.getElementById("center").style.display = "none";

      const a = document.getElementById("link");
      a.href = `https://sepolia.etherscan.io/tx/${txObj.hash}`;
      document.getElementById("link").style.display = "block";
    })
    .catch((error) => {
      console.error("Transaction failed:", error);
      document.getElementById("center").style.display = "none";
      alert("Transaction failed: " + error.message);
    });
}

// Check balance of the address in the "Transfer Address" field
function checkBalance() {
  const addressToCheck = document.getElementById("address").value;

  // Validation - make sure address is provided
  if (!addressToCheck) {
    alert(
      "Please enter an address in the 'Transfer Address' field to check its balance"
    );
    return;
  }

  // Basic address format validation
  if (!addressToCheck.startsWith("0x") || addressToCheck.length !== 42) {
    alert(
      "Please enter a valid Ethereum address (should start with 0x and be 42 characters long)"
    );
    return;
  }

  document.getElementById("center").style.display = "flex";

  const balanceBtn = document.getElementById("check_balance");
  const originalText = balanceBtn.innerText;
  balanceBtn.innerText = "Checking...";
  balanceBtn.disabled = true;

  // Fixed: Use consistent provider initialization
  const provider = new ethers.JsonRpcProvider(
    "https://eth-sepolia.g.alchemy.com/v2/vEWDw8Bnbgz1IedM5nNzqQNKNAtA6gml"
  );

  console.log("Checking balance for address:", addressToCheck);

  provider
    .getBalance(addressToCheck)
    .then((balance) => {
      const balanceInETH = ethers.formatEther(balance); // Fixed: removed .utils

      console.log(`Balance: ${balanceInETH} ETH`);

      // Show the balance on the button
      balanceBtn.innerText = `Balance: ${parseFloat(balanceInETH).toFixed(
        6
      )} ETH`;

      document.getElementById("center").style.display = "none";

      // Reset button after 5 seconds
      setTimeout(() => {
        balanceBtn.innerText = originalText;
        balanceBtn.disabled = false;
      }, 5000);
    })
    .catch((error) => {
      console.error("Balance check failed:", error);
      document.getElementById("center").style.display = "none";
      balanceBtn.innerText = originalText;
      balanceBtn.disabled = false;
      alert("Failed to check balance. Please verify the address is correct.");
    });
}
