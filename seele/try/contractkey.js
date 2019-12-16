const sle  = require('./../sle')
const Web3 = require('web3');
var web3 = new Web3
// console.log(web3);
// var key = web3.eth.accounts.create();
var tar = '0xF070273c0B08B5c9de23C3cA8B2022a4ee043a5b'
var pri = '0x678ae2496dfb443a542b75f4819a684e54292498c1ea860eb9c3d8897b219935'
var acc = web3.eth.accounts.privateKeyToAccount(pri).address;
console.log(`web3  : ${acc}`);
var pub = sle.offline.key.pubof(pri)
console.log(`seele : ${pub}`);
console.log(`goal  : ${tar}`);
