// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.5.0;
// pragma experimental ABIEncoderV2;

contract ExpiredDateTracker {

    struct GoodsInfo {
        string _itemName;
        uint _quantity;
        uint _expiredTimestamp;
    }

    uint[] public _expired;
    uint[] public _unexpired;
    
    event Expire(uint itemId);
    
    uint _itemId;
    mapping(uint => GoodsInfo) public _mapGoodsInfo;
    
    address _owner;
    
	// to restrict access to non admin users
	modifier onlyByOwner{
		require(msg.sender == _owner, "Unauthorised Access");
		_;
	}
    
	// constructor
	constructor() public{
	    _itemId = 1;
	    _owner = msg.sender;
    }
    
    function inputData(string memory itemName, uint quantity ,uint expiredTimestamp) public onlyByOwner{
        GoodsInfo memory info = GoodsInfo(itemName, quantity, expiredTimestamp);
        _mapGoodsInfo[_itemId] = info;
        _unexpired.push(_itemId);
        _itemId++;
    }
    
    function checkData(uint _timestamp) public {
        for(uint i=0;i<_unexpired.length;i++){
            GoodsInfo memory info = _mapGoodsInfo[_unexpired[i]];
            if(info._expiredTimestamp <= _timestamp) {
                emit Expire(_unexpired[i]);
                _expired.push(_unexpired[i]);
                burnData(i);
            }
        }
    }
    
    function burnData(uint index) public {
        require(index < _unexpired.length, "burn error for unexpired date");
    
        for (uint i = index; i<_unexpired.length-1; i++){
            _unexpired[i] = _unexpired[i+1];
        }
        _unexpired.pop();
    }
    
    function getTimestamp() public view returns (uint256){
        return block.timestamp;
    }
    
    function getExpired() public view returns (string memory){
        string memory strRes="";
	    for(uint256 i=0;i<_expired.length;i++){
            GoodsInfo memory info = _mapGoodsInfo[_expired[i]];
	        
            strRes = concatString(strRes, info._itemName);
            strRes = concatString(strRes, "#");
            strRes = concatString(strRes, integerToString(info._quantity));
            strRes = concatString(strRes, "#");
            strRes = concatString(strRes, integerToString(info._expiredTimestamp));
            if(i<_expired.length-1) strRes = concatString(strRes, "@");
	    }
	    return strRes;
    }
    
    function getUnexpired() public view returns (string memory){
        string memory strRes="";
	    for(uint256 i=0;i<_unexpired.length;i++){
            GoodsInfo memory info = _mapGoodsInfo[_unexpired[i]];
            strRes = concatString(strRes, info._itemName);
            strRes = concatString(strRes, "#");
            strRes = concatString(strRes, integerToString(info._quantity));
            strRes = concatString(strRes, "#");
            strRes = concatString(strRes, integerToString(info._expiredTimestamp));
            if(i<_unexpired.length-1) strRes = concatString(strRes, "@");
	    }
	    return strRes;
    }
    
    function integerToString(uint256 _i)  internal pure returns (string memory) {
        if (_i == 0) {
             return "0";
        }
        uint256 j = _i;
        uint256 len;
        
        while (j != 0) {
             len++;
             j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len - 1;
        
        while (_i != 0) {
             bstr[k--] = byte(uint8(48 + _i % 10));
             _i /= 10;
        }
        return string(bstr);
    }
    
    function concatString(string memory str1, string memory str2) internal pure returns(string memory) {
        bytes memory _str1 = bytes(str1);
        bytes memory _str2 = bytes(str2);
        string memory strRes = new string(_str1.length + _str2.length);
        bytes memory _strRes = bytes(strRes);
        
        uint256 k = 0; uint256 i=0;
        for (i = 0; i < _str1.length; i++) _strRes[k++] = _str1[i];
        for (i = 0; i < _str2.length; i++) _strRes[k++] = _str2[i];

        return string(_strRes);
    }
}