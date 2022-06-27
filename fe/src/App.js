import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

function App() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const nonce = uuidv4();
  const metamaskSignin = async () => {
    const signature = await signer.signMessage(nonce); // request user to sign the nonce and get the signature
    console.log(signature);
  };
  return (
    <div className="App">
      <button type="button" className="" onClick={() => metamaskSignin}>
        登入
      </button>
    </div>
  );
}

export default App;
