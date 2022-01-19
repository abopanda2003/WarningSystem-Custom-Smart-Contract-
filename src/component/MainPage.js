import React from 'react';
import {MainPageWrapper, CheckButton, ConnectButton} from './style'
import InputUnexpCmp from './InputUnexpPanel';
import InputExpCmp from './InputExpPanel';
import TimeComp from './TimeComp';
import {Grid} from '@material-ui/core';
import Web3 from 'web3';
import eventBus from "../EventBus";
import PredictionPicker from './PredictionPicker';

class MainCmp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            publicKey: "Connect to wallet", 
            walletKey: "",
            isSettedForWallet: false,
            prdTs: 0
        };
        this.connectMetamask = this.connectMetamask.bind(this);
    }
    async componentDidMount() {
        this.confirmSetWallet();
        window.ethereum.on('accountsChanged', 
                (accounts) => this.setState({publicKey: String(accounts).slice(0,6)+"..."}));

    }
    confirmSetWallet(){
        let web3 = new Web3(window.ethereum);
        web3.eth.getAccounts((err, accounts)=>{
            if (err != null) console.log("An error occurred");
            else if (accounts.length === 0) console.log("User is not logged in to MetaMask");
            else {
                this.setWalletKey(web3);
            }
        });
    }
    setWalletKey(web3) {
        let returnStr = web3.currentProvider.selectedAddress;
        let temp_public_key = returnStr;
        let key_short = temp_public_key.slice(0, 6);
        this.setState({
            publicKey: key_short+"...", 
            walletKey:returnStr,
            isSettedForWallet:true
        });
    }
    async connectMetamask(){
        if(this.state.type === "none") return;
        if (window.ethereum) {
            let web3 = new Web3(window.ethereum);
            try {
                window.ethereum.enable().then((res)=> {
                    this.setWalletKey(web3);
                });
            } catch(e) {}    
        } 
    }
    sleep = async (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }    
    onCheck = async () => {
        let nowTs = new Date().getTime()/1000;
        // console.log("current timestamp:",parseInt(nowTs));
        await this.check(parseInt(nowTs));
    }
    onPredict = async () => {
        if(this.state.prdTs == 0) {
            alert('Please select prdiction date'); return;
        }
        await this.check(this.state.prdTs);
    }
    async check(timestamp) {
        let data = await window.$myContract.methods.checkData(timestamp).encodeABI();
        let txInfo = {
            from: window.ethereum.selectedAddress,
            to: window.$bettingContractAddress,
            value: window.$web3.utils.toHex(window.$web3.utils.toWei("0")),
            data: data
        }
        window.ethereum.request({ method: 'eth_sendTransaction', params: [txInfo] }).then( async (res) => {
            if(res) {
                new Promise(resolve => setTimeout(resolve, 5000));
                let transactionReceipt = null;
                while (transactionReceipt == null) {
                    transactionReceipt = await window.$web3.eth.getTransactionReceipt(res);
                    new Promise(resolve => setTimeout(resolve, 3000));
                }
                eventBus.dispatch("update", {});
            }
        });
    }
    async onDateChange(value){
        let timestamp = new Date(value).getTime()/1000;
        if(timestamp == null || timestamp == 0) return;
        this.setState({prdTs:parseInt(timestamp)});
    }
    render() {
        return (
            <MainPageWrapper>
                <Grid container style={{height:"100px", display:"flex", justifyContent:"center"}}>
                    <Grid item xs = {2} style={{marginLeft:"160px"}}>
                        <TimeComp />
                    </Grid>
                    <Grid item xs = {2}></Grid>
                    <Grid item xs = {2} style={{marginTop:"30px",marginRight:"-60px"}}>
                        <PredictionPicker parentIns={this}></PredictionPicker>
                    </Grid>
                    <Grid item xs = {1} >
                        <CheckButton onClick={this.onPredict}>Predict</CheckButton>
                    </Grid>
                    <Grid item xs = {1} style={{marginLeft:"10px"}}>
                        <CheckButton onClick={this.onCheck}>Check</CheckButton>
                    </Grid>
                    <Grid item xs = {1} style={{marginLeft:"10px"}}>
                        <ConnectButton onClick={this.connectMetamask}>{this.state.publicKey}</ConnectButton>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs = {12} sm = {12} md = {1}></Grid>
                    <Grid item xs = {12} sm = {12} md = {4}>
                        <InputUnexpCmp  title="Unexpired Items"></InputUnexpCmp>
                    </Grid>
                    <Grid item xs = {12} sm = {12} md = {2}></Grid>
                    <Grid item xs = {12} sm = {12} md = {4}>
                        <InputExpCmp title="Expired Items"></InputExpCmp>
                    </Grid>
                    <Grid item xs = {12} sm = {12} md = {1}></Grid>
                </Grid>
            </MainPageWrapper>
        );
    }
}

export default MainCmp;