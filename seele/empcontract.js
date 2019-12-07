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
let amount   = 1
var address  = '0xd75fbd11818d0f1b45054142d01f584a08970002'
var shard    = sle.offline.key.shard(address)
var rpc      = new sle.rpcjson(node[shard], 1)
let byt      = null
var abi = fs.readJsonSync(path.join(__dirname, 'abi', 'subchain', 'StemRootchain.json'))

// var hash = '0x4d7de0030128fa5fa16c1e818362406d2d9b8d53362c26ce7f392767c5949f4d'
// var name = 'printAddress'
// event(hash, name, abi)

var req
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
// req = makeReq('discard', )
// req =  makeReq('getOwner',)
// call(address, req.bytes, req.types )
// employ(address, req.bytes, req.types )

async function event(hash, name, abi){
  var receipt = await rpc.getReceiptByTxHash(hash,"")
  var logs = receipt.logs
  for ( var log of logs ) {
    var obj = findByField(abi, 'name', name).inputs
    var hex = log.data
    var tpc = log.topics
    var result = web3.eth.abi.decodeLog(obj, hex, tpc)
    console.log(result);
  }
}

async function call(address, byt, types){
  // -1 is the height
  rpc.call(address, byt, -1).then(a=>{
    // console.log(a.result);
    var result = web3.eth.abi.decodeParameters(types, a.result);
    console.log(result);
  })
}

async function employ(address, byt, types){
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
            && send == 'duplicate tx'
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
  var abi = fs.readJsonSync(path.join(__dirname, 'abi.json'))
  var SimpleStorageContract = new web3.eth.Contract(abi)
  var byt = SimpleStorageContract.methods[name](...args).encodeABI();
  var types = findByField(abi, 'name', name)
  return {
    bytes: byt,
    types: types.outputs
  };
}