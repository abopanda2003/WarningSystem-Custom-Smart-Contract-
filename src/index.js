import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Web3 from 'web3';
import Abi from './abi.json';
import reportWebVitals from './reportWebVitals';

window.$web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/v3/b04f4ec70af648a48d92c6315e24e4d3"));
window.$bettingContractAddress = "0x0fa056c060cBC7638fF57Ae5D7D31db7a2B285E4";
window.$myContract = new window.$web3.eth.Contract(Abi, window.$bettingContractAddress);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
