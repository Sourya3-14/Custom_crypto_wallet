document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("form").addEventListener("click", handler);
});

function handler(event) {
  document.getElementById("center").style.display = "flex";//loading cycle
  const private_key = document.getElementById("private_key").value;
  const amount = document.getElementById("amount").value;
  const address = document.getElementById("address").value;

  const provider = new ethers.providers.JsonRpcProvider(
    "https://eth-mainnet.g.alchemy.com/v2/vEWDw8Bnbgz1IedM5nNzqQNKNAtA6gml"
  );

  let wallet = new ethers.Wallet(private_key, provider);

  const tx = {
    to: address,
    value: ethers.parseEthers(amount),
  };

  var a = document.getElementById("link");
  a.href = "some link url";

  wallet.sendTransaction(tx).then((txObj) => {
    console.log("TxHash", txObj.hash);
    document.getElementById("center").style.display = "none";
    const a = document.getElementById("link");
    a.href = `https://sepolia.etherscan.io//tx/${txObj.hash}`;
    document.getElementById("link").style.display = "block";
  });
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("check_balance")
    .addEventListener("click", checkBalance);
});

function checkBalance() {
  document.getElementById("center").style.display = "flex";

  //Provider
  const provider = new ethers.providers.JsonRpcProvider(
    "https://eth-mainnet.g.alchemy.com/v2/vEWDw8Bnbgz1IedM5nNzqQNKNAtA6gml"
  );

  const signer = provider.getSigner();

  console.log(signer);
  const address = document.getElementById("address").value;

  provider.getBalance(address).then((balance) => {
    //convert a currency unit from wei to ether
    const balanceInETH = ethers.formatEther(balance);
    document.getElementById(
      "check_balance"
    ).innerText = `Your Balance: ${balanceInETH} ETH`;
    console.log(`balance: ${balanceInETH} ETH`);
    document.getElementById("center").style.display = "none";
  });
}
