import React from 'react';
import {InputWrapper, InputTitleWrapper, SplitBar, InputTextField, ItemRegButton} from './style'
import TableDataPanel from './TableDataPanel';
import DatePickers from './DatePicker';
import {Grid} from '@material-ui/core';
import moment from 'moment';
import ethTx from 'ethereumjs-tx';
import eventBus from "../EventBus";

export default class InputUnexpCmp extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            _itemName: "",
            _itemQuantity: 0,
            _expiredDate: 0,
            _unexpData: []
        }
        this.onRegister = this.onRegister.bind(this);
    }
    componentDidMount() {
        this.onLoadData();
        eventBus.on("update", (data) =>
            this.onLoadData()
        );
        eventBus.on("predict", (data) =>
            this.onPredictData(data)
        );
    }
    componentWillUnmount() {
        eventBus.remove("update");
    }
    async onLoadData(){
        let unexpRes = await window.$myContract.methods.getUnexpired().call();
        this.setState({
            _unexpData: this.loadRealData(unexpRes),
        });
    }
    async onPredictData(data){
        let unexpRes = await window.$myContract.methods.getUnexpired().call();
        this.setState({
            _unexpData: this.loadPredictData(unexpRes, data.prdTs),
        });
    }
    onInputChange(evt){
        if(evt.target.id=="item_name")
            this.setState({_itemName: evt.target.value});
        else this.setState({_itemQuantity: evt.target.value});
    }
    onDateChange=(value)=>{
        let timestamp = new Date(value).getTime()/1000;
        if(timestamp==0 || timestamp==null) {
            alert("please select date correctly"); return;
        }
        this.setState({_expiredDate:timestamp});
    }
    sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }    
    loadRealData(data){
        let records = String(data).split("@");
        let res = [];
        for(let i=0; i<records.length; i++){
            let cols = records[i].split("#");
            res.push({
                itemName: cols[0],
                itemQuantity: cols[1],
                date: moment(parseInt(cols[2])*1000).format("L")
            });
        }
        return res;
    }
    loadPredictData(data, timestamp){
        let records = String(data).split("@");
        let res = [];
        for(let i=0; i<records.length; i++){
            let cols = records[i].split("#");
            res.push({
                itemName: cols[0],
                itemQuantity: cols[1],
                date: parseInt(cols[2])
            });
        }        
        return res.filter(data => data.date < timestamp).map(data => ({
            itemName: data.itemName,
            itemQuantity: data.itemQuantity,
            date: moment(data.date * 1000).format("L")
        }));
    }
    async onTest() {
        let data = await window.$myContract.methods.requestVolumeData().call();
        console.log(data);
    }
    async onRegister() {
        let itemN = this.state._itemName;
        let itemQ = this.state._itemQuantity;
        let expDt = this.state._expiredDate;
        let data = await window.$myContract.methods.inputData(itemN, itemQ, expDt).encodeABI();
        let txInfo = {
            from: window.ethereum.selectedAddress,
            to: window.$bettingContractAddress,
            value: window.$web3.utils.toHex(window.$web3.utils.toWei("0")),
            data: data
        }
        window.ethereum.request({ method: 'eth_sendTransaction', params: [txInfo] }).then( async (res) => {
            if(res){
                await this.sleep(5000);
                let transactionReceipt = null;
                while (transactionReceipt == null) {
                    transactionReceipt = await window.$web3.eth.getTransactionReceipt(res);
                    await this.sleep(3000);
                }
                eventBus.dispatch("update", {});
            }
        });
    }
    checkData() {
        window.$web3.transactionConfirmationBlocks = 1;
        // Sender address and private key
        // Second acccount in dev.json genesis file
        // Exclude 0x at the beginning of the private key
        const addressFrom = '0xD391a0D473a052De64D9bbbe649df498b5243B29'
        const privKey = Buffer.from('2d105e09563b9cff0f6682b0d3a8c5c6299844d1f1a5276513e4bdcfe3216164', 'hex')
        
        // Receiver address and value to transfer
        // Third account in dev.json genesis file
        const addressTo = '0xc9930FD70F8DceE4278f74d22271A93060c041FC'
        // const valueInEther = 2
        let myData=window.$myContract.methods.checkData().encodeABI()
        // Get the address transaction count in order to specify the correct nonce
        window.$web3.eth.getTransactionCount(addressFrom, "pending").then((txnCount) => {
          // Create the transaction object
            let txObject = {
                nonce: window.$web3.utils.numberToHex(txnCount),
                gasPrice: window.$web3.utils.numberToHex(1000),
                gasLimit: window.$web3.utils.numberToHex(2100000),
                to: addressTo,
                value: window.$web3.utils.numberToHex(window.$web3.utils.toWei('0', 'ether')),
                data: myData
            };
            const Tx = require("ethereumjs-tx");
            // Sign the transaction with the private key
            let tx = new Tx(txObject);
            tx.sign(privKey)
            
            //Convert to raw transaction string
            let serializedTx = tx.serialize();
            let rawTxHex = '0x' + serializedTx.toString('hex');
            
            // log raw transaction data to the console so you can send it manually
            console.log("Raw transaction data: " + rawTxHex);
            
            // but also ask you if you want to send this transaction directly using web3
            (async() => {
                window.$web3.eth.sendSignedTransaction(rawTxHex)
                    .on('receipt', receipt => { 
                        console.log('Receipt: ', receipt); 
                    }).catch(error => {
                        console.log('Error: ', error.message); 
                    });
            })();
        }).catch(error => { console.log('Error: ', error.message); });        
    }
    render () {
        return (
            <InputWrapper>
                <Grid container>
                    <Grid item xs = {12} sm = {8} md = {1}></Grid>
                    <Grid item xs = {12} sm = {8} md = {10}>
                        <Grid container style={{height:"80px"}}>
                            <Grid item xs = {12} sm = {12} md = {11} style={{display:"flex", justifyContent:"center"}}>
                                <InputTitleWrapper>{this.props.title}</InputTitleWrapper>
                            </Grid>
                            <SplitBar></SplitBar>
                        </Grid>
                        <Grid container style={{height:"200px"}}>
                            <Grid item xs = {12}>
                                <span style={{color:"white"}}>Item Name: <InputTextField  id="item_name" style={{marginLeft:"18px"}}  onChange = {e=>this.onInputChange(e)}/></span>
                            </Grid>
                            <Grid item xs = {12}>
                                <span style={{color:"white"}}>Item Quantity: <InputTextField id="item_quantity"  onChange = {e=>this.onInputChange(e)}/></span>
                            </Grid>
                            <Grid item xs = {12}>
                                <DatePickers parentIns={this}></DatePickers>
                            </Grid>
                            <Grid item xs = {12}>
                                {/* <ItemRegButton onClick={this.onTest}>Register</ItemRegButton> */}
                                <ItemRegButton onClick={this.onRegister}>Register</ItemRegButton>
                            </Grid>
                            <SplitBar></SplitBar>
                        </Grid>
                        <Grid container style={{height:"200px", overflow:"auto"}}>
                            <TableDataPanel data={this.state._unexpData}></TableDataPanel>
                        </Grid>
                    </Grid>
                    <Grid item xs = {12} sm = {8} md = {1}>
                    </Grid>
                </Grid>
            </InputWrapper>
        );
    }
}