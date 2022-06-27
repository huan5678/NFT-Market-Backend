import { useState } from 'react';
import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const requestAccount = async () => {
    if (window.ethereum) {
      console.log('detected metamask');
      try {
        const account = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setWalletAddress(account[0]);
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log('no metamask extension');
      window.location.href = 'https://metamask.io/';
    }
  };
  const connectWallet = async () => {
    if (window.ethereum !== 'undefined') {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const nonce = uuidv4();
      const signature = await signer.signMessage(nonce); // request user to sign the nonce and get the signature
      console.log(signature);
    }
  };
  return (
    <div className="App">
      <button type="button" onClick={connectWallet}>
        Connect Wallet
      </button>
      <button type="button" className="" onClick={requestAccount}>
        登入
      </button>
      <p>{walletAddress}</p>
    </div>
  );
}

export default App;
