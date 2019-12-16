const term = require( 'terminal-kit' ).terminal
const fs   = require('fs-extra')
const path = require('path')
const Web3 = require('web3')
const web3 = new Web3()
const sle  = require('./sle')
let node     = [ 0, 'http://117.50.97.136:18037', 'http://117.50.97.136:8038', 'http://104.218.164.77:8039', 'http://117.50.97.136:8036']
// let abi      = fs.readJsonSync(path.join(__dirname, 'abi', 'subchain', 'StemRootchain.json'))
let abi      = fs.readJsonSync(path.join(__dirname, 'abi.json'))
let block    = 2
let limit    = 6000000
var address  = '0xcc6ac33adcf86be4bf4576d8dd7ea6678c270022'
var shard    = sle.offline.key.shard(address)
var rpc      = new sle.rpcjson(node[shard], 1)
let byt      = null
var account = '0x3f78b08f45730f59a15319af41ba5a750021c541'


class STEM {
  constructor(address){
    this.address = address;
  }

  // view
  see(name){
    var address = this.address
    return new Promise(async function(resolve, reject) {
      // console.log(name);
      // console.log(args);
      // console.log(name);
      var req = makeReq(name, arguments)
      try {
        var result = await call(address, req.bytes, req.types)
        resolve(result)
      } catch (e) {
        reject(e)
      }
    });
  }

  // none payable
  use(name){
    var address = this.address
    return new Promise(function(resolve, reject) {

    });
  }

  // payable
  pay(name){
    var address = this.address
    return new Promise(function(resolve, reject) {

    });
  }
}


abi.forEach(command => {
  if ( command.type === "function" && command.stateMutability === "view" ) {
    var cp = STEM.prototype
    cp[command.name] = function() {
      return this.see(command.name, ...arguments);
    }
  } else if ( command.type === "function" && command.stateMutability === "nonpayable" ) {
    var cp = STEM.prototype
    cp[command.name] = function() {
      return this.use(command.name, ...arguments);
    }
  } else if ( command.type === "function" && command.stateMutability === "payable" ) {
    var cp = STEM.prototype
    cp[command.name] = function() {
      return this.pay(command.name, ...arguments);
    }
  }
})

module.exports = STEM

async function call(address, byt, types){
  var a = await rpc.call(address, byt, -1)
  var result = web3.eth.abi.decodeParameters(types, a.result);
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

function makeReq(name, ...arguments){
  var SimpleStorageContract = new web3.eth.Contract(abi)
  // console.log(...args);
  // console.log(name);
  var args = Array.prototype.slice.call(arguments, 1)
  if (typeof args[args.length - 1] === 'function') {
    resolve = args[args.length - 1].bind(this);
    reject = args.pop().bind(this);
  }
  var byt = SimpleStorageContract.methods[name](...args).encodeABI();
  var types = findByField(abi, 'name', name)
  return {
    bytes: byt,
    types: types.outputs
  };
}
