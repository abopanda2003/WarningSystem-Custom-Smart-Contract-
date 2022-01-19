import React from 'react';
import {TimeDisplayWrapper, EndsInfo, BeginInfo} from './style';
import moment from 'moment';
import ethTx from 'ethereumjs-tx';
import {Grid} from '@material-ui/core';

export default class TimeComp extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            _blockTimestamp: 0
        }
        this.timer = 0;
        this.startTimer=this.startTimer.bind(this);
        this.timerEvent=this.timerEvent.bind(this);
    }
    async componentDidMount(){
        let timeStamp = await window.$myContract.methods.getTimestamp().call();
        this.setState({_blockTimestamp: parseInt(timeStamp)});
        this.startTimer();
    }
    startTimer() {
        if (this.timer == 0 && this.state._blockTimestamp > 0) {
            this.timer = setInterval(this.timerEvent, 1000);
        }
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
        
            // Sign the transaction with the private key
            let tx = new ethTx(txObject);
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
    async timerEvent() {
        let timeStamp = await window.$myContract.methods.getTimestamp().call();
        timeStamp = parseInt(timeStamp);
        this.setState({_blockTimestamp: timeStamp});
        if(timeStamp % 86400 == 0) await this.checkData();
    }
    render() {
        return(
            <TimeDisplayWrapper>
                <EndsInfo>{moment(this.state._blockTimestamp*1000).format('YYYY-MM-DD')} {moment(this.state._blockTimestamp*1000).format('hh:mm:ss')}</EndsInfo>
            </TimeDisplayWrapper>
        );
    }
}