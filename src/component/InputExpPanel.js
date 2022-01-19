import React from 'react';
import {InputWrapper, InputTitleWrapper, SplitBar} from './style'
import TableDataPanel from './TableDataPanel';
import {Grid} from '@material-ui/core';
import moment from 'moment';
import eventBus from "../EventBus";

export default class InputExpCmp extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            _itemName: "",
            _itemQuantity: 0,
            _expiredDate: 0,
            _expData: []
        }
    }
    componentDidMount() {
        this.onLoadData();
        eventBus.on("update", (data) =>
            this.onLoadData()
        );
    }
    componentWillUnmount() {
        eventBus.remove("update");
    }
    async onLoadData(){
        let expRes = await window.$myContract.methods.getExpired().call();
        this.setState({
            _expData: this.loadRealData(expRes),
        });
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
                        <Grid container style={{height:"400px"}}>
                            <TableDataPanel data={this.state._expData}></TableDataPanel>
                        </Grid>
                    </Grid>
                    <Grid item xs = {12} sm = {8} md = {1}>
                    </Grid>
                </Grid>
            </InputWrapper>
        );
    }
}
