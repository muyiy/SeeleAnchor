const term = require( 'terminal-kit' ).terminal
const fs   = require('fs-extra')
const path = require('path')
const Web3 = require('web3')
const web3 = new Web3()
const sle  = require('./seele')
let node     = [ 0, 'http://117.50.97.136:18037', 'http://117.50.97.136:8038', 'http://104.218.164.77:8039', 'http://117.50.97.136:8036']
let pri      = '0x58ccd6d932014767b903210377fea81f684e37534cbb765d12529b2882db2a03'
let block    = 2
let limit    = 6000000
//let amount   = 0
var address  = '0xcc6ac33adcf86be4bf4576d8dd7ea6678c270022'
var shard    = sle.offline.key.shard(address)
var rpc      = new sle.rpcjson(node[shard], 1)
let byt      = null
var abi = fs.readJsonSync(path.join(__dirname, 'abi', 'subchain', 'StemRootchain.json'))

var account = '0x3f78b08f45730f59a15319af41ba5a750021c541'



var req
//  req = makeReq('isFrozen',)
// req = makeReq('isOperatorExisted', '0xca35b7d915458ef540ade6068dfe2f44e8fa733c')
// req = makeReq('getTotalDeposit', )
// req = makeReq('getOpsLen',)
// req = makeReq('getCurDepositBlockNum',)
// req = makeReq('getLastChildBlockNum',)
// req = makeReq('getOperatorBalance','0x2E361D2057aEdeA19243489DE9fbC517b8fa2CE8')
// req = makeReq('getTotalDeposit',)
// req = makeReq('challengeSubmittedBlock','0x2E361D2057aEdeA19243489DE9fbC517b8fa2CE8',[],[],[],[],[],[])
// req = makeReq('isOperatorExisted','0x2E361D2057aEdeA19243489DE9fbC517b8fa2CE8')
// req = makeReq('getChildBlockSubmitter',0)
// req = makeReq('getContractBalance',)
// req = makeReq('getCurDepositBlockNum', )
// req = makeReq('submitBlock', 1000, '0x4f2df4a21621b18c71619239c398657a23f198a40a8deff701e340e6e34d0823', '0x4f2df4a21621b18c71619239c398657a23f198a40a8deff701e340e6e34d0823', ['0x2E361D2057aEdeA19243489DE9fbC517b8fa2CE8', '0xca35b7d915458ef540ade6068dfe2f44e8fa733c', '0x627306090abab3a6e1400e9345bc60c78a8bef57'], [100, 90, 105], 0)
//  req = makeReq('discard', )
// req =  makeReq('getOwner',)
var res
wraper()

async function wraper() {
  await wrap1() 
  await wrap2() 
  await wrap3() 
  await wrap4() 
  await wrap5() 
  await wrap6() 
  await wrap7() 
  // await setTimeout(function(){ wrap7()}, 63000);
  // await wrap8() 


  // await setTimeout(function(){  wrap9()}, 63000);
  // await wrap9()
  // await setTimeout(function(){  wrap10()}, 63000);
  // await wrap10()
  // await setTimeout(function(){  wrap11()}, 63000);
  // await wrap11()
  // await wrap12()
}

async function wrap1(){
  //var a = await bal(account)
  //console.log(a)

  req = makeReq('getChildChainName',)
  res = await call(address, req.bytes, req.types )
  console.log("Childchain name")
  console.log(res['0'])

  req = makeReq('getOperatorBalance', '0xca35b7d915458ef540ade6068dfe2f44e8fa733c')
  res = await call(address, req.bytes, req.types )
  console.log("\nOperator balance of 0xca35b7d915458ef540ade6068dfe2f44e8fa733c")
  console.log(res['0'])

  req = makeReq('getOperatorFee', '0xca35b7d915458ef540ade6068dfe2f44e8fa733c')
  res = await call(address, req.bytes, req.types )
  console.log("\nOperator fee of 0xca35b7d915458ef540ade6068dfe2f44e8fa733c")
  console.log(res['0'])

  req = makeReq('isOperatorExisted', '0xca35b7d915458ef540ade6068dfe2f44e8fa733c')
  res = await call(address, req.bytes, req.types )
  console.log("\nIs operator 0xca35b7d915458ef540ade6068dfe2f44e8fa733c existed")
  console.log(res['0'])

  req = makeReq('getFeeBackup',)
  res = await call(address, req.bytes, req.types )
  console.log("\nFeeBackup")
  console.log(res['0'])

  req = makeReq('getStaticNodes', 0)
  res = await call(address, req.bytes, req.types )
  console.log("\nStatic node 0")
  console.log(res['0'])

  req = makeReq('getOpsLen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nNumber of operators")
  console.log(res['0'])

  req = makeReq('getCreatorDeposit', )
  res = await call(address, req.bytes, req.types )
  console.log("\nCreator deposit")
  console.log(res['0'])

  req = makeReq('getLastChildBlockNum', )
  res = await call(address, req.bytes, req.types )
  console.log("\nLast child block num")
  console.log(res['0'])

  req = makeReq('getNextChildBlockNum', )
  res = await call(address, req.bytes, req.types )
  console.log("\nNext child block num")
  console.log(res['0'])

  req = makeReq('getOwner', )
  res = await call(address, req.bytes, req.types )
  console.log("\nchain owner")
  console.log(res['0'])

  req = makeReq('getChildBlockTxRootHash', 0)
  res = await call(address, req.bytes, req.types )
  console.log("\nTx root hash of child block 0")
  console.log(res['0'])

  req = makeReq('getChildBlockBalanceRootHash', 0)
  res = await call(address, req.bytes, req.types )
  console.log("\nBalance root hash of child block 0")
  console.log(res['0'])

  req = makeReq('getChildBlockSubmitter', 0)
  res = await call(address, req.bytes, req.types )
  console.log("\nBlock submitter of child block 0")
  console.log(res['0'])

  req = makeReq('getCurDepositBlockNum', )
  res = await call(address, req.bytes, req.types )
  console.log("\nCur deposit block num")
  console.log(res['0'])

  req = makeReq('getCurExitBlockNum', )
  res = await call(address, req.bytes, req.types )
  console.log("\nCur exit block num")
  console.log(res['0'])

  req = makeReq('getTotalDeposit', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal deposit")
  console.log(res['0'])

  req = makeReq('getTotalDepositBackup', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal deposit backup")
  console.log(res['0'])

  req = makeReq('getDepositsLen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nThe number of deposits")
  console.log(res['0'])

  req = makeReq('getDepositBlockNum', '0xaF4AFca83C31196F8E4134526FfeD8aF58921D7d')
  res = await call(address, req.bytes, req.types )
  console.log("\nDeposit block number of 0xaF4AFca83C31196F8E4134526FfeD8aF58921D7d")
  console.log(res['0'])

  req = makeReq('getDepositType', '0xaF4AFca83C31196F8E4134526FfeD8aF58921D7d')
  res = await call(address, req.bytes, req.types )
  console.log("\nDeposit type of 0xaF4AFca83C31196F8E4134526FfeD8aF58921D7d")
  console.log(res['0'])

  req = makeReq('getDepositAccounts', )
  res = await call(address, req.bytes, req.types )
  console.log("\nDeposit accounts")
  console.log(res['0'])

  req = makeReq('getExitsLen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nThe number of exits")
  console.log(res['0'])

  req = makeReq('getExitBlockNum', '0xca35b7d915458ef540ade6068dfe2f44e8fa733c')
  res = await call(address, req.bytes, req.types )
  console.log("\nExit block number of 0xca35b7d915458ef540ade6068dfe2f44e8fa733c")
  console.log(res['0'])

  req = makeReq('getExitAmount', '0xca35b7d915458ef540ade6068dfe2f44e8fa733c')
  res = await call(address, req.bytes, req.types )
  console.log("\nExit amount of 0xca35b7d915458ef540ade6068dfe2f44e8fa733c")
  console.log(res['0'])

  req = makeReq('getExitType', '0xca35b7d915458ef540ade6068dfe2f44e8fa733c')
  res = await call(address, req.bytes, req.types )
  console.log("\nExit type of 0xca35b7d915458ef540ade6068dfe2f44e8fa733c")
  console.log(res['0'])

  req = makeReq('getExitStatus', '0xca35b7d915458ef540ade6068dfe2f44e8fa733c')
  res = await call(address, req.bytes, req.types )
  console.log("\nExit status of 0xca35b7d915458ef540ade6068dfe2f44e8fa733c")
  console.log(res['0'])

  req = makeReq('getExitAccounts', )
  res = await call(address, req.bytes, req.types )
  console.log("\nExit accounts")
  console.log(res['0'])

  req = makeReq('getTotalBalance', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal balance")
  console.log(res['0'])

  req = makeReq('getTotalFee', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal fee")
  console.log(res['0'])

  req = makeReq('getContractBalance', )
  res = await call(address, req.bytes, req.types )
  console.log("\nContract balance")
  console.log(res['0'])

  req = makeReq('getChallengeLen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nThe number of challenges")
  console.log(res['0'])

  req = makeReq('getChildBlockTimestamp', 0)
  res = await call(address, req.bytes, req.types )
  console.log("\nThe timestamp of child block 0")
  console.log(res['0'])

  req = makeReq('isFrozen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nis frozen")
  console.log(res['0'])

  // var b = await employ(address, req.bytes, req.types )
  // employ(address, req.bytes, req.types )
  //var d = await bal(account)
  //console.log(d)
  // console.log(`${a}\n${JSON.stringify(b)}\n${d}`)
}

async function wrap2(){
  req = makeReq('addOperatorRequest', '0x806d4E8855be019C7572936c3C864d92bB4BD9b0', '0x3f78b08f45730f59a15319af41ba5a750021c541')
  res = await employ(address, req.bytes, req.types, 200)
  console.log("\nadd operator 0x806d4E8855be019C7572936c3C864d92bB4BD9b0")

  req = makeReq('addOperatorRequest', '0x6fdB6B8ba6646939e59b966AF6064586D41DaEF6', '0x3f78b08f45730f59a15319af41ba5a750021c541')
  res = await employ(address, req.bytes, req.types, 250)
  console.log("\nadd operator 0x6fdB6B8ba6646939e59b966AF6064586D41DaEF6")

  req = makeReq('userDepositRequest', '0xcC66c62F3F83fb795C2e6190C2600DBfd418C234', '0x3f78b08f45730f59a15319af41ba5a750021c541')
  res = await employ(address, req.bytes, req.types, 100)
  console.log("\nadd user 0xcC66c62F3F83fb795C2e6190C2600DBfd418C234")


}

async function wrap3(){
  req = makeReq('getDepositsLen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nThe number of deposits")
  console.log(res['0'])

  req = makeReq('getDepositBlockNum', '0x6fdB6B8ba6646939e59b966AF6064586D41DaEF6')
  res = await call(address, req.bytes, req.types )
  console.log("\nDeposit block number of 0x6fdB6B8ba6646939e59b966AF6064586D41DaEF6")
  console.log(res['0'])

  req = makeReq('getDepositAmount', '0x6fdB6B8ba6646939e59b966AF6064586D41DaEF6')
  res = await call(address, req.bytes, req.types )
  console.log("\nDeposit amount of 0x6fdB6B8ba6646939e59b966AF6064586D41DaEF6")
  console.log(res['0'])

  req = makeReq('getDepositType', '0x6fdB6B8ba6646939e59b966AF6064586D41DaEF6')
  res = await call(address, req.bytes, req.types )
  console.log("\nDeposit type of 0x6fdB6B8ba6646939e59b966AF6064586D41DaEF6")
  console.log(res['0'])

  req = makeReq('getDepositBlockNum', '0xcC66c62F3F83fb795C2e6190C2600DBfd418C234')
  res = await call(address, req.bytes, req.types )
  console.log("\nDeposit block number of 0xcC66c62F3F83fb795C2e6190C2600DBfd418C234")
  console.log(res['0'])

  req = makeReq('getDepositAmount', '0xcC66c62F3F83fb795C2e6190C2600DBfd418C234')
  res = await call(address, req.bytes, req.types )
  console.log("\nDeposit amount of 0xcC66c62F3F83fb795C2e6190C2600DBfd418C234")
  console.log(res['0'])

  req = makeReq('getDepositType', '0xcC66c62F3F83fb795C2e6190C2600DBfd418C234')
  res = await call(address, req.bytes, req.types )
  console.log("\nDeposit type of 0xcC66c62F3F83fb795C2e6190C2600DBfd418C234")
  console.log(res['0'])

  req = makeReq('getDepositAccounts', )
  res = await call(address, req.bytes, req.types )
  console.log("\nDeposit accounts")
  console.log(res['0'])

  req = makeReq('getTotalDeposit', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal deposit")
  console.log(res['0'])

  req = makeReq('getTotalBalance', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal balance")
  console.log(res['0'])

  req = makeReq('getTotalFee', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal fee")
  console.log(res['0'])

  req = makeReq('getContractBalance', )
  res = await call(address, req.bytes, req.types )
  console.log("\nContract balance")
  console.log(res['0'])

  var a = await bal(account)
  console.log(a)

}

async function wrap4(){
  req = makeReq('operatorExitRequest', '0x6fdB6B8ba6646939e59b966AF6064586D41DaEF6')
  res = await employ(address, req.bytes, req.types, 0)
  console.log("\noperator 0x6fdB6B8ba6646939e59b966AF6064586D41DaEF6 trying to exit")

  req = makeReq('userExitRequest', '0xcC66c62F3F83fb795C2e6190C2600DBfd418C234', 50)
  res = await employ(address, req.bytes, req.types, 1)
  console.log("\n user 0xcC66c62F3F83fb795C2e6190C2600DBfd418C234 trying to exit")
}

async function wrap5() {
  req = makeReq('getDepositsLen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nThe number of deposits")
  console.log(res['0'])

  req = makeReq('getDepositBlockNum', '0x6fdB6B8ba6646939e59b966AF6064586D41DaEF6')
  res = await call(address, req.bytes, req.types )
  console.log("\nDeposit block number of 0x6fdB6B8ba6646939e59b966AF6064586D41DaEF6")
  console.log(res['0'])

  req = makeReq('getDepositAmount', '0x6fdB6B8ba6646939e59b966AF6064586D41DaEF6')
  res = await call(address, req.bytes, req.types )
  console.log("\nDeposit amount of 0x6fdB6B8ba6646939e59b966AF6064586D41DaEF6")
  console.log(res['0'])

  req = makeReq('getDepositType', '0x6fdB6B8ba6646939e59b966AF6064586D41DaEF6')
  res = await call(address, req.bytes, req.types )
  console.log("\nDeposit type of 0x6fdB6B8ba6646939e59b966AF6064586D41DaEF6")
  console.log(res['0'])

  req = makeReq('getDepositBlockNum', '0xcC66c62F3F83fb795C2e6190C2600DBfd418C234')
  res = await call(address, req.bytes, req.types )
  console.log("\nDeposit block number of 0xcC66c62F3F83fb795C2e6190C2600DBfd418C234")
  console.log(res['0'])

  req = makeReq('getDepositAmount', '0xcC66c62F3F83fb795C2e6190C2600DBfd418C234')
  res = await call(address, req.bytes, req.types )
  console.log("\nDeposit amount of 0xcC66c62F3F83fb795C2e6190C2600DBfd418C234")
  console.log(res['0'])

  req = makeReq('getDepositType', '0xcC66c62F3F83fb795C2e6190C2600DBfd418C234')
  res = await call(address, req.bytes, req.types )
  console.log("\nDeposit type of 0xcC66c62F3F83fb795C2e6190C2600DBfd418C234")
  console.log(res['0'])

  req = makeReq('getDepositAccounts', )
  res = await call(address, req.bytes, req.types )
  console.log("\nDeposit accounts")
  console.log(res['0'])

  req = makeReq('getTotalDeposit', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal deposit")
  console.log(res['0'])

  req = makeReq('getTotalBalance', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal balance")
  console.log(res['0'])

  req = makeReq('getTotalFee', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal fee")
  console.log(res['0'])

  req = makeReq('getContractBalance', )
  res = await call(address, req.bytes, req.types )
  console.log("\nContract balance")
  console.log(res['0'])

  var a = await bal(account)
  console.log(a)
}

async function wrap6(){
  req = makeReq('submitBlock', 1000, '0x0541f8a317ff1b9e13379d46f5d67062666b74eefad90431e9fe46b3ed7d723e', '0x0bb650a613bd81bb21db5a56b3a455c6b2e2c79cc2ad75c19f12f86c77e84fa4', ['0x627306090abab3a6e1400e9345bc60c78a8bef57'], [100], 0)
  res = await employ(address, req.bytes, req.types, 1)
  console.log("\n submit block 1000")

  req = makeReq('getOpsLen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nNumber of operators")
  console.log(res['0'])

  req = makeReq('getLastChildBlockNum', )
  res = await call(address, req.bytes, req.types )
  console.log("\nLast child block num")
  console.log(res['0'])

  req = makeReq('getNextChildBlockNum', )
  res = await call(address, req.bytes, req.types )
  console.log("\nNext child block num")
  console.log(res['0'])

  req = makeReq('getOwner', )
  res = await call(address, req.bytes, req.types )
  console.log("\nchain owner")
  console.log(res['0'])

  req = makeReq('getChildBlockTxRootHash', 1000)
  res = await call(address, req.bytes, req.types )
  console.log("\nTx root hash of child block 1000")
  console.log(res['0'])

  req = makeReq('getChildBlockBalanceRootHash', 1000)
  res = await call(address, req.bytes, req.types )
  console.log("\nBalance root hash of child block 1000")
  console.log(res['0'])

  req = makeReq('getChildBlockSubmitter', 1000)
  res = await call(address, req.bytes, req.types )
  console.log("\nBlock submitter of child block 1000")
  console.log(res['0'])

  req = makeReq('getCurDepositBlockNum', )
  res = await call(address, req.bytes, req.types )
  console.log("\nCur deposit block num")
  console.log(res['0'])

  req = makeReq('getCurExitBlockNum', )
  res = await call(address, req.bytes, req.types )
  console.log("\nCur exit block num")
  console.log(res['0'])

  req = makeReq('getTotalDeposit', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal deposit")
  console.log(res['0'])

  req = makeReq('getTotalBalance', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal balance")
  console.log(res['0'])

  req = makeReq('getTotalFee', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal fee")
  console.log(res['0'])

  req = makeReq('getContractBalance', )
  res = await call(address, req.bytes, req.types )
  console.log("\nContract balance")
  console.log(res['0'])

}

async function wrap7() {
  req = makeReq('submitBlock', 2000, '0x0541f8a317ff1b9e13379d46f5d67062666b74eefad90431e9fe46b3ed7d723e','0x0bb650a613bd81bb21db5a56b3a455c6b2e2c79cc2ad75c19f12f86c77e84fa4', 
  ['0x806d4E8855be019C7572936c3C864d92bB4BD9b0', '0xca35b7d915458ef540ade6068dfe2f44e8fa733c', 
    '0x627306090abab3a6e1400e9345bc60c78a8bef57', '0xcC66c62F3F83fb795C2e6190C2600DBfd418C234'], [200, 90, 105, 50], 1)
  res = await employ(address, req.bytes, req.types, 1)
  console.log("\n submit block 2000")

  req = makeReq('getOperatorBalance', '0x806d4E8855be019C7572936c3C864d92bB4BD9b0')
  res = await call(address, req.bytes, req.types )
  console.log("\nOperator balance of 0x806d4E8855be019C7572936c3C864d92bB4BD9b0")
  console.log(res['0'])

  req = makeReq('getOperatorFee', '0x806d4E8855be019C7572936c3C864d92bB4BD9b0')
  res = await call(address, req.bytes, req.types )
  console.log("\nOperator fee of 0x806d4E8855be019C7572936c3C864d92bB4BD9b0")
  console.log(res['0'])

  req = makeReq('isOperatorExisted', '0x806d4E8855be019C7572936c3C864d92bB4BD9b0')
  res = await call(address, req.bytes, req.types )
  console.log("\nIs operator 0x806d4E8855be019C7572936c3C864d92bB4BD9b0 existed")
  console.log(res['0'])

  req = makeReq('isUserExisted', '0xcC66c62F3F83fb795C2e6190C2600DBfd418C234')
  res = await call(address, req.bytes, req.types )
  console.log("\nIs user 0xcC66c62F3F83fb795C2e6190C2600DBfd418C234 existed")
  console.log(res['0'])

  req = makeReq('getUserBalance', '0xcC66c62F3F83fb795C2e6190C2600DBfd418C234')
  res = await call(address, req.bytes, req.types )
  console.log("\nUser balance of 0xcC66c62F3F83fb795C2e6190C2600DBfd418C234")
  console.log(res['0'])

  req = makeReq('getAccountBackup', 0)
  res = await call(address, req.bytes, req.types )
  console.log("\nAccountBackup 0")
  console.log(res['0'])

  req = makeReq('getBalanceBackup', 0)
  res = await call(address, req.bytes, req.types )
  console.log("\nBalanceBackup 0")
  console.log(res['0'])

  req = makeReq('getFeeBackup',)
  res = await call(address, req.bytes, req.types )
  console.log("\nFeeBackup")
  console.log(res['0'])

  req = makeReq('getOpsLen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nNumber of operators")
  console.log(res['0'])

  req = makeReq('getLastChildBlockNum', )
  res = await call(address, req.bytes, req.types )
  console.log("\nLast child block num")
  console.log(res['0'])

  req = makeReq('getNextChildBlockNum', )
  res = await call(address, req.bytes, req.types )
  console.log("\nNext child block num")
  console.log(res['0'])

  req = makeReq('getChildBlockTxRootHash', 2000)
  res = await call(address, req.bytes, req.types )
  console.log("\nTx root hash of child block 2000")
  console.log(res['0'])

  req = makeReq('getChildBlockBalanceRootHash', 2000)
  res = await call(address, req.bytes, req.types )
  console.log("\nBalance root hash of child block 2000")
  console.log(res['0'])

  req = makeReq('getChildBlockSubmitter', 2000)
  res = await call(address, req.bytes, req.types )
  console.log("\nBlock submitter of child block 2000")
  console.log(res['0'])

  req = makeReq('getCurDepositBlockNum', )
  res = await call(address, req.bytes, req.types )
  console.log("\nCur deposit block num")
  console.log(res['0'])

  req = makeReq('getCurExitBlockNum', )
  res = await call(address, req.bytes, req.types )
  console.log("\nCur exit block num")
  console.log(res['0'])

  req = makeReq('getTotalDeposit', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal deposit")
  console.log(res['0'])

  req = makeReq('getTotalDepositBackup', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal deposit backup")
  console.log(res['0'])

  req = makeReq('getDepositsLen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nThe number of deposits")
  console.log(res['0'])

  req = makeReq('getDepositAccounts', )
  res = await call(address, req.bytes, req.types )
  console.log("\nDeposit accounts")
  console.log(res['0'])

  req = makeReq('getExitsLen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nThe number of exits")
  console.log(res['0'])

  req = makeReq('getExitAccounts', )
  res = await call(address, req.bytes, req.types )
  console.log("\nExit accounts")
  console.log(res['0'])

  req = makeReq('getTotalBalance', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal balance")
  console.log(res['0'])

  req = makeReq('getTotalFee', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal fee")
  console.log(res['0'])

  req = makeReq('getContractBalance', )
  res = await call(address, req.bytes, req.types )
  console.log("\nContract balance")
  console.log(res['0'])

  req = makeReq('getChallengeLen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nThe number of challenges")
  console.log(res['0'])

  req = makeReq('getChildBlockTimestamp', 2000)
  res = await call(address, req.bytes, req.types )
  console.log("\nThe timestamp of child block 2000")
  console.log(res['0'])

  req = makeReq('isFrozen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nis frozen")
  console.log(res['0'])

}

async function wrap8(){
   req = makeReq('operatorExitRequest', '0x583031d1113ad414f02576bd6afabfb302140225')
   res = await employ(address, req.bytes, req.types, 0)
   console.log("\n exit operator 0x583031d1113ad414f02576bd6afabfb302140225")

  req = makeReq('removeDepositRequest', '0xcC66c62F3F83fb795C2e6190C2600DBfd418C234')
  res = await employ(address, req.bytes, req.types, 0)
  console.log("\n remove deposit request of 0xcC66c62F3F83fb795C2e6190C2600DBfd418C234")

  req = makeReq('userExitRequest', '0xcC66c62F3F83fb795C2e6190C2600DBfd418C234', 25)
  res = await employ(address, req.bytes, req.types, 1)
  console.log("\n exit user 0xcC66c62F3F83fb795C2e6190C2600DBfd418C234")

  req = makeReq('getExitsLen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nThe number of exits")
  console.log(res['0'])

  req = makeReq('getExitBlockNum', '0xcC66c62F3F83fb795C2e6190C2600DBfd418C234')
  res = await call(address, req.bytes, req.types )
  console.log("\nExit block number of 0xcC66c62F3F83fb795C2e6190C2600DBfd418C234")
  console.log(res['0'])

  req = makeReq('getExitAmount', '0xcC66c62F3F83fb795C2e6190C2600DBfd418C234')
  res = await call(address, req.bytes, req.types )
  console.log("\nExit amount of 0xcC66c62F3F83fb795C2e6190C2600DBfd418C234")
  console.log(res['0'])

  req = makeReq('getExitType', '0xcC66c62F3F83fb795C2e6190C2600DBfd418C234')
  res = await call(address, req.bytes, req.types )
  console.log("\nExit type of 0xcC66c62F3F83fb795C2e6190C2600DBfd418C234")
  console.log(res['0'])

  req = makeReq('getExitStatus', '0xcC66c62F3F83fb795C2e6190C2600DBfd418C234')
  res = await call(address, req.bytes, req.types )
  console.log("\nExit status of 0xcC66c62F3F83fb795C2e6190C2600DBfd418C234")
  console.log(res['0'])

  req = makeReq('getExitAccounts', )
  res = await call(address, req.bytes, req.types )
  console.log("\nExit accounts")
  console.log(res['0'])

}

async function wrap9(){
  req = makeReq('submitBlock', 3000, '0x0541f8a317ff1b9e13379d46f5d67062666b74eefad90431e9fe46b3ed7d723e', '0x0bb650a613bd81bb21db5a56b3a455c6b2e2c79cc2ad75c19f12f86c77e84fa4', [], [], 0)
  res = await employ(address, req.bytes, req.types, 1)
  console.log("\n submit block 3000")

  req = makeReq('getTotalBalance', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal balance")
  console.log(res['0'])

  req = makeReq('getTotalFee', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal fee")
  console.log(res['0'])

  req = makeReq('getContractBalance', )
  res = await call(address, req.bytes, req.types )
  console.log("\nContract balance")
  console.log(res['0'])

  req = makeReq('getChildBlockTimestamp', 3000)
  res = await call(address, req.bytes, req.types )
  console.log("\nThe timestamp of child block 3000")
  console.log(res['0'])

  req = makeReq('isFrozen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nis frozen")
  console.log(res['0'])

}

async function wrap10() {
  req = makeReq('submitBlock', 4000, '0x0541f8a317ff1b9e13379d46f5d67062666b74eefad90431e9fe46b3ed7d7222','0x0bb650a613bd81bb21db5a56b3a455c6b2e2c79cc2ad75c19f12f86c77e84f22', 
  ['0x583031d1113ad414f02576bd6afabfb302140225', '0xca35b7d915458ef540ade6068dfe2f44e8fa733c', 
    '0x627306090abab3a6e1400e9345bc60c78a8bef57', '0xcC66c62F3F83fb795C2e6190C2600DBfd418C234'], [0, 80, 111, 25], 1)
  res = await employ(address, req.bytes, req.types, 1)
  console.log("\n submit block 4000")

  req = makeReq('getOperatorBalance', '0x583031d1113ad414f02576bd6afabfb302140225')
  res = await call(address, req.bytes, req.types )
  console.log("\nOperator balance of 0x583031d1113ad414f02576bd6afabfb302140225")
  console.log(res['0'])

  req = makeReq('getOperatorFee', '0x583031d1113ad414f02576bd6afabfb302140225')
  res = await call(address, req.bytes, req.types )
  console.log("\nOperator fee of 0x583031d1113ad414f02576bd6afabfb302140225")
  console.log(res['0'])

  req = makeReq('isOperatorExisted', '0x583031d1113ad414f02576bd6afabfb302140225')
  res = await call(address, req.bytes, req.types )
  console.log("\nIs operator 0x583031d1113ad414f02576bd6afabfb302140225 existed")
  console.log(res['0'])

  req = makeReq('isUserExisted', '0xcC66c62F3F83fb795C2e6190C2600DBfd418C234')
  res = await call(address, req.bytes, req.types )
  console.log("\nIs user 0xcC66c62F3F83fb795C2e6190C2600DBfd418C234 existed")
  console.log(res['0'])

  req = makeReq('getUserBalance', '0xcC66c62F3F83fb795C2e6190C2600DBfd418C234')
  res = await call(address, req.bytes, req.types )
  console.log("\nUser balance of 0xcC66c62F3F83fb795C2e6190C2600DBfd418C234")
  console.log(res['0'])

  req = makeReq('getAccountBackup', 0)
  res = await call(address, req.bytes, req.types )
  console.log("\nAccountBackup 0")
  console.log(res['0'])

  req = makeReq('getBalanceBackup', 0)
  res = await call(address, req.bytes, req.types )
  console.log("\nBalanceBackup 0")
  console.log(res['0'])

  req = makeReq('getFeeBackup',)
  res = await call(address, req.bytes, req.types )
  console.log("\nFeeBackup")
  console.log(res['0'])

  req = makeReq('getOpsLen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nNumber of operators")
  console.log(res['0'])

  req = makeReq('getLastChildBlockNum', )
  res = await call(address, req.bytes, req.types )
  console.log("\nLast child block num")
  console.log(res['0'])

  req = makeReq('getNextChildBlockNum', )
  res = await call(address, req.bytes, req.types )
  console.log("\nNext child block num")
  console.log(res['0'])

  req = makeReq('getChildBlockTxRootHash', 4000)
  res = await call(address, req.bytes, req.types )
  console.log("\nTx root hash of child block 4000")
  console.log(res['0'])

  req = makeReq('getChildBlockBalanceRootHash', 4000)
  res = await call(address, req.bytes, req.types )
  console.log("\nBalance root hash of child block 4000")
  console.log(res['0'])

  req = makeReq('getChildBlockSubmitter', 4000)
  res = await call(address, req.bytes, req.types )
  console.log("\nBlock submitter of child block 4000")
  console.log(res['0'])

  req = makeReq('getCurDepositBlockNum', )
  res = await call(address, req.bytes, req.types )
  console.log("\nCur deposit block num")
  console.log(res['0'])

  req = makeReq('getCurExitBlockNum', )
  res = await call(address, req.bytes, req.types )
  console.log("\nCur exit block num")
  console.log(res['0'])

  req = makeReq('getTotalDeposit', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal deposit")
  console.log(res['0'])

  req = makeReq('getTotalDepositBackup', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal deposit backup")
  console.log(res['0'])

  req = makeReq('getDepositsLen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nThe number of deposits")
  console.log(res['0'])

  req = makeReq('getDepositAccounts', )
  res = await call(address, req.bytes, req.types )
  console.log("\nDeposit accounts")
  console.log(res['0'])

  req = makeReq('getExitsLen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nThe number of exits")
  console.log(res['0'])

  req = makeReq('getExitAccounts', )
  res = await call(address, req.bytes, req.types )
  console.log("\nExit accounts")
  console.log(res['0'])

  req = makeReq('getTotalBalance', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal balance")
  console.log(res['0'])

  req = makeReq('getTotalFee', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal fee")
  console.log(res['0'])

  req = makeReq('getContractBalance', )
  res = await call(address, req.bytes, req.types )
  console.log("\nContract balance")
  console.log(res['0'])

  req = makeReq('getChallengeLen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nThe number of challenges")
  console.log(res['0'])

  req = makeReq('getChildBlockTimestamp', 4000)
  res = await call(address, req.bytes, req.types )
  console.log("\nThe timestamp of child block 4000")
  console.log(res['0'])

  req = makeReq('isFrozen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nis frozen")
  console.log(res['0'])

}

async function wrap11() {

  req = makeReq('reverseBlock', 4000)
  res = await employ(address, req.bytes, req.types, 0)
  console.log("\n reverse block 4000")

  req = makeReq('getOperatorBalance', '0x583031d1113ad414f02576bd6afabfb302140225')
  res = await call(address, req.bytes, req.types )
  console.log("\nOperator balance of 0x583031d1113ad414f02576bd6afabfb302140225")
  console.log(res['0'])

  req = makeReq('getOperatorFee', '0x583031d1113ad414f02576bd6afabfb302140225')
  res = await call(address, req.bytes, req.types )
  console.log("\nOperator fee of 0x583031d1113ad414f02576bd6afabfb302140225")
  console.log(res['0'])

  req = makeReq('isOperatorExisted', '0x583031d1113ad414f02576bd6afabfb302140225')
  res = await call(address, req.bytes, req.types )
  console.log("\nIs operator 0x583031d1113ad414f02576bd6afabfb302140225 existed")
  console.log(res['0'])

  req = makeReq('isUserExisted', '0xcC66c62F3F83fb795C2e6190C2600DBfd418C234')
  res = await call(address, req.bytes, req.types )
  console.log("\nIs user 0xcC66c62F3F83fb795C2e6190C2600DBfd418C234 existed")
  console.log(res['0'])

  req = makeReq('getUserBalance', '0xcC66c62F3F83fb795C2e6190C2600DBfd418C234')
  res = await call(address, req.bytes, req.types )
  console.log("\nUser balance of 0xcC66c62F3F83fb795C2e6190C2600DBfd418C234")
  console.log(res['0'])

  req = makeReq('getFeeBackup',)
  res = await call(address, req.bytes, req.types )
  console.log("\nFeeBackup")
  console.log(res['0'])

  req = makeReq('getOpsLen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nNumber of operators")
  console.log(res['0'])

  req = makeReq('getLastChildBlockNum', )
  res = await call(address, req.bytes, req.types )
  console.log("\nLast child block num")
  console.log(res['0'])

  req = makeReq('getNextChildBlockNum', )
  res = await call(address, req.bytes, req.types )
  console.log("\nNext child block num")
  console.log(res['0'])

  req = makeReq('getChildBlockTxRootHash', 4000)
  res = await call(address, req.bytes, req.types )
  console.log("\nTx root hash of child block 4000")
  console.log(res['0'])

  req = makeReq('getChildBlockBalanceRootHash', 4000)
  res = await call(address, req.bytes, req.types )
  console.log("\nBalance root hash of child block 4000")
  console.log(res['0'])

  req = makeReq('getChildBlockSubmitter', 4000)
  res = await call(address, req.bytes, req.types )
  console.log("\nBlock submitter of child block 4000")
  console.log(res['0'])

  req = makeReq('getCurDepositBlockNum', )
  res = await call(address, req.bytes, req.types )
  console.log("\nCur deposit block num")
  console.log(res['0'])

  req = makeReq('getCurExitBlockNum', )
  res = await call(address, req.bytes, req.types )
  console.log("\nCur exit block num")
  console.log(res['0'])

  req = makeReq('getTotalDeposit', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal deposit")
  console.log(res['0'])

  req = makeReq('getTotalDepositBackup', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal deposit backup")
  console.log(res['0'])

  req = makeReq('getDepositsLen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nThe number of deposits")
  console.log(res['0'])

  req = makeReq('getDepositAccounts', )
  res = await call(address, req.bytes, req.types )
  console.log("\nDeposit accounts")
  console.log(res['0'])

  req = makeReq('getExitsLen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nThe number of exits")
  console.log(res['0'])

  req = makeReq('getExitAccounts', )
  res = await call(address, req.bytes, req.types )
  console.log("\nExit accounts")
  console.log(res['0'])

  req = makeReq('getExitStatus', '0x583031D1113aD414F02576BD6afaBfb302140225')
  res = await call(address, req.bytes, req.types )
  console.log("\nExit status of 0x583031D1113aD414F02576BD6afaBfb302140225")
  console.log(res['0'])

  req = makeReq('getExitStatus', '0xcC66c62F3F83fb795C2e6190C2600DBfd418C234')
  res = await call(address, req.bytes, req.types )
  console.log("\nExit status of 0xcC66c62F3F83fb795C2e6190C2600DBfd418C234")
  console.log(res['0'])

  req = makeReq('getTotalBalance', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal balance")
  console.log(res['0'])

  req = makeReq('getTotalFee', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal fee")
  console.log(res['0'])

  req = makeReq('getContractBalance', )
  res = await call(address, req.bytes, req.types )
  console.log("\nContract balance")
  console.log(res['0'])

  req = makeReq('getChallengeLen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nThe number of challenges")
  console.log(res['0'])

  req = makeReq('getChildBlockTimestamp', 4000)
  res = await call(address, req.bytes, req.types )
  console.log("\nThe timestamp of child block 4000")
  console.log(res['0'])

  req = makeReq('isFrozen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nis frozen")
  console.log(res['0'])
}

async function wrap12() {
  req = makeReq('submitBlock', 4000, '0x0541f8a317ff1b9e13379d46f5d67062666b74eefad90431e9fe46b3ed7d7222','0x0bb650a613bd81bb21db5a56b3a455c6b2e2c79cc2ad75c19f12f86c77e84f22', 
  ['0x583031d1113ad414f02576bd6afabfb302140225', '0xca35b7d915458ef540ade6068dfe2f44e8fa733c', 
    '0x627306090abab3a6e1400e9345bc60c78a8bef57', '0xcC66c62F3F83fb795C2e6190C2600DBfd418C234'], [0, 80, 111, 25], 1)
  res = await employ(address, req.bytes, req.types, 1)
  console.log("\n submit block 4000 again")

  req = makeReq('getOperatorBalance', '0x583031d1113ad414f02576bd6afabfb302140225')
  res = await call(address, req.bytes, req.types )
  console.log("\nOperator balance of 0x583031d1113ad414f02576bd6afabfb302140225")
  console.log(res['0'])

  req = makeReq('getOperatorFee', '0x583031d1113ad414f02576bd6afabfb302140225')
  res = await call(address, req.bytes, req.types )
  console.log("\nOperator fee of 0x583031d1113ad414f02576bd6afabfb302140225")
  console.log(res['0'])

  req = makeReq('isOperatorExisted', '0x583031d1113ad414f02576bd6afabfb302140225')
  res = await call(address, req.bytes, req.types )
  console.log("\nIs operator 0x583031d1113ad414f02576bd6afabfb302140225 existed")
  console.log(res['0'])

  req = makeReq('isUserExisted', '0xcC66c62F3F83fb795C2e6190C2600DBfd418C234')
  res = await call(address, req.bytes, req.types )
  console.log("\nIs user 0xcC66c62F3F83fb795C2e6190C2600DBfd418C234 existed")
  console.log(res['0'])

  req = makeReq('getUserBalance', '0xcC66c62F3F83fb795C2e6190C2600DBfd418C234')
  res = await call(address, req.bytes, req.types )
  console.log("\nUser balance of 0xcC66c62F3F83fb795C2e6190C2600DBfd418C234")
  console.log(res['0'])

  req = makeReq('getAccountBackup', 0)
  res = await call(address, req.bytes, req.types )
  console.log("\nAccountBackup 0")
  console.log(res['0'])

  req = makeReq('getBalanceBackup', 0)
  res = await call(address, req.bytes, req.types )
  console.log("\nBalanceBackup 0")
  console.log(res['0'])

  req = makeReq('getFeeBackup',)
  res = await call(address, req.bytes, req.types )
  console.log("\nFeeBackup")
  console.log(res['0'])

  req = makeReq('getOpsLen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nNumber of operators")
  console.log(res['0'])

  req = makeReq('getLastChildBlockNum', )
  res = await call(address, req.bytes, req.types )
  console.log("\nLast child block num")
  console.log(res['0'])

  req = makeReq('getNextChildBlockNum', )
  res = await call(address, req.bytes, req.types )
  console.log("\nNext child block num")
  console.log(res['0'])

  req = makeReq('getChildBlockTxRootHash', 4000)
  res = await call(address, req.bytes, req.types )
  console.log("\nTx root hash of child block 4000")
  console.log(res['0'])

  req = makeReq('getChildBlockBalanceRootHash', 4000)
  res = await call(address, req.bytes, req.types )
  console.log("\nBalance root hash of child block 4000")
  console.log(res['0'])

  req = makeReq('getChildBlockSubmitter', 4000)
  res = await call(address, req.bytes, req.types )
  console.log("\nBlock submitter of child block 4000")
  console.log(res['0'])

  req = makeReq('getCurDepositBlockNum', )
  res = await call(address, req.bytes, req.types )
  console.log("\nCur deposit block num")
  console.log(res['0'])

  req = makeReq('getCurExitBlockNum', )
  res = await call(address, req.bytes, req.types )
  console.log("\nCur exit block num")
  console.log(res['0'])

  req = makeReq('getTotalDeposit', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal deposit")
  console.log(res['0'])

  req = makeReq('getTotalDepositBackup', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal deposit backup")
  console.log(res['0'])

  req = makeReq('getDepositsLen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nThe number of deposits")
  console.log(res['0'])

  req = makeReq('getDepositAccounts', )
  res = await call(address, req.bytes, req.types )
  console.log("\nDeposit accounts")
  console.log(res['0'])

  req = makeReq('getExitsLen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nThe number of exits")
  console.log(res['0'])

  req = makeReq('getExitAccounts', )
  res = await call(address, req.bytes, req.types )
  console.log("\nExit accounts")
  console.log(res['0'])

  req = makeReq('getTotalBalance', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal balance")
  console.log(res['0'])

  req = makeReq('getTotalFee', )
  res = await call(address, req.bytes, req.types )
  console.log("\nTotal fee")
  console.log(res['0'])

  req = makeReq('getContractBalance', )
  res = await call(address, req.bytes, req.types )
  console.log("\nContract balance")
  console.log(res['0'])

  req = makeReq('getChallengeLen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nThe number of challenges")
  console.log(res['0'])

  req = makeReq('getChildBlockTimestamp', 4000)
  res = await call(address, req.bytes, req.types )
  console.log("\nThe timestamp of child block 4000")
  console.log(res['0'])

  req = makeReq('isFrozen', )
  res = await call(address, req.bytes, req.types )
  console.log("\nis frozen")
  console.log(res['0'])

}






async function call(address, byt, types){
  // -1 is the height
  var a = await rpc.call(address, byt, -1)
  var result = web3.eth.abi.decodeParameters(types, a.result);
    // console.log(result);
  return result
}

async function employ(address, byt, types, amount){
  var from      = sle.offline.key.pubof(pri)
  var to        = address
  var amt       = amount
  var lim       = limit
  var price     = 0
  var load      = byt
  var loud      = 1
  var diff      = block
  // console.log(from);
  // console.log(to);
  var receipt  = await mustSend(pri, from, to, amount, lim, price, load, loud, diff)
  console.log(receipt);
}

async function bal(account){
  var bal = await rpc.getBalance(account,'', -1);
  // console.log(bal.Balance)
  return bal.Balance
}

async function mustSend(pri, from, to, amount, lim, price, load, loud, diff){
  return new Promise(async function(resolve, reject) {
    var initTx  = sle.offline.tx.init(from, to, amount, load)
    var shard   = sle.offline.key.shard(from)
    var rpc     = new sle.rpcjson(node[shard], 1)

    var balance   = await rpc.getBalance(from,'',-1)
    var nonce     = await rpc.getAccountNonce(from,'',-1)
    var data = {
      "Data": {
        "From":         from,
        "To":           to,
        "Amount":       0,
        "GasPrice":     1,
        "GasLimit":     lim,
        "Payload":      load,
        "AccountNonce": nonce
      }
    }
    var notabort = true
    // creation
    try {
      var result  = await rpc.estimateGas(data)
      if (result == lim) {
        var notabort = false
        console.log(load);
        reject('Abort Transaction: fee overflow')
      }
    } catch(err) {
      reject(err);
    }
    initTx.GasLimit     = lim;
    initTx.AccountNonce = nonce;
    
    var signedTx        = sle.offline.tx.sign(pri, initTx);
    console.log(signedTx);
    // term(`hash: ${signedTx.Hash}\n`);
    console.log('');
    var bgin = Date.now()
    
    // send loop 
    try {
      var notyet = true
      var time, info, send, txbh, rcbh, fail = null
      while ( notyet && notabort) {
        time, info, send, txbh, rcbh, fail = null
        var result = await Promise.all([
          rpc.getInfo(),
          rpc.addTx(signedTx),
          rpc.getTransactionByHash(signedTx.Hash),
          rpc.getReceiptByTxHash(signedTx.Hash,"")
        ]).then( result => {
          if (result[0].error ) { info = result[0].error.message }
          else {
            info = result[0].CurrentBlockHeight - result[2].blockHeight 
            if ( !Number.isInteger(info) ) info = '_'
          }
          if (result[1].error ) { send = result[1].error.message }
          else send = result[1]
          if (result[2].error ) { txbh = result[2].error.message }
          else txbh = result[2].status
          if (result[3].error ) { rcbh = result[3].error.message }
          else {
            rcbh = result[3].contract
            fail = result[3].failed
          }
          
          time = Date.now()
          term
          .previousLine(1)
          .eraseLineAfter()
          .cyan(parseInt((time - bgin)/1000), 's :')
          .white( `status: ${txbh}`)
          .blue(` depth: ${info}/${diff}`)
          .green(` receipt: ${rcbh}`)
          .yellow(` send: ${send}` )
          .green(` fail: ${fail}\n`)
          
          if ( txbh == 'block'
            && send == 'Tx already exists'
            && info >= diff
            && /0x.*/.test(rcbh) ) 
          {
            notyet = false
            resolve(result[3])
          } 
        }).catch( e => {
          console.error(e);
        })
      } 
    } catch (err) {
      reject(err)
    }
    
    resolve(signedTx)
  });
}

function findByField(list, field, name){
  for ( var item of list ) {
    if (item[field] == name ) {
      return item
    }
  }
}

function makeReq(name, ...args){
  var abi = fs.readJsonSync(path.join(__dirname, '/abi/subchain/StemRootchain.json'))
  var SimpleStorageContract = new web3.eth.Contract(abi)
  var byt = SimpleStorageContract.methods[name](...args).encodeABI();
  var types = findByField(abi, 'name', name)
  return {
    bytes: byt,
    types: types.outputs
  };
}