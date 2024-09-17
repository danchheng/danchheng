import { useState } from 'react'
import './App.css'
import products from './contracts/Products.json';
import { ethers } from 'ethers';
import { Signer } from 'ethers';
import { Contract } from 'ethers';

function App() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [defaultAccount, setDefaultAccount] = useState<string | null>(null);
  const [connButtonText, setConnButtonText] = useState('Connect Wallet');

  const [provider, setProvider] = useState<any | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);

  const contractAddress = '0xc0D1802C37BE4e042DbABA1D6Ea1B76bE85fe8cb';

  const [inStock, setStock] = useState<number | null>(null);

  async function connectMetamaskWallet() : Promise<void> {
    (window as any).ethereum.request({
      method: 'eth_requestAccounts',
    }).then(
      async (accounts : string[]) => {
        setDefaultAccount(accounts[0]);
        setConnButtonText('Disconnect');

        let _provider = new ethers.BrowserProvider((window as any).ethereum);
        setProvider(_provider);

        let _signer = await _provider.getSigner();
        setSigner(_signer);

        let _contract = new ethers.Contract(contractAddress, products.abi, _signer);
        setContract(_contract);

      }).catch((error: any) => {

        setErrorMessage(error.message);
        alert(errorMessage);
      });
  }

  async function getProductStock() : Promise<void> {
    if (contract) {
      try {
        const _stock = await contract.getQuantity();
        setStock(_stock);
      } catch (error) {
        setErrorMessage('Can not get product stock');
      }
    } else {
      setErrorMessage('No contract found');
    }
  }

  return (
    <>
    <div>
      <h3>{"Get/Set iteration with contract!"}</h3>
      <button onClick={connectMetamaskWallet}>{connButtonText}</button>
      <h3>Address: {defaultAccount}</h3>
      <button onClick={getProductStock}>Product in stock</button>
      <h2>{inStock?.toString()}</h2>
      <h2>{errorMessage}</h2>
    </div>
    </>
  )
}

export default App