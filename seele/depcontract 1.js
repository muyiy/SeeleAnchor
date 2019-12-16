const cliSpinners = require('cli-spinners');
const spinicon    = cliSpinners.dots
const ora   = require('ora');
const term  = require( 'terminal-kit' ).terminal
const sle   = require('./seele')
const fs    = require('fs-extra')
const path  = require('path')
const Web3  = require('web3')
let   solc  = require('solc')
let   spin  = ora()
var   web3  = new Web3
// console.log(fs);
// network 
let node = [ 0, 'http://117.50.97.136:18037', 'http://117.50.97.136:8038', 'http://104.218.164.77:8039', 'http://117.50.97.136:8036']
// 0x4018c661af9979d2ed47a21a44ed5ff7eb27af2af95a4878ab76a32d42b9959a
// compiling
var skipDeploy  = false
var skipCompile = true
let abidir= path.join(__dirname, 'abi', 'subchain')
let dir   = path.join(__dirname, 'contract', 'subchain')
let temp  = path.join(__dirname, 'tempp.json')
let ver   = '0.4.24'
let sol   = path.join(__dirname, 'solc', ver)

// Transation
let addressbook = {
   "ECRecovery.sol": "0x76160289048e360ddc98561fd6dea35b992d0002",
   "Merkle.sol": "0x43286991ff7fc5ee685e5245215cd32c11240012",
   "RLP.sol": "0x00a9e712cba18e2e1d382f47afac5366f1520012",
   "RLPEncoding.sol": "0x7d8ed46a39b26762adff912b19951f4f17170022",
   "SafeMath.sol": "0x276488129b5e2525bfad13d162179b33eac80002",
   "StemCore.sol": "0x85c7ad2a2dd7faec0381f94667f0e1d692050002",
   "StemCreation.sol": "0x8c463e06087499c9bd8518acd49c878a4b6b0002",
   "StemChallenge.sol": "0x30f729894513f26d6e54fe0f87b1b01905ea0022",
   "StemRelay.sol": "0xd66387385b59c63a58c8956701682569e4e90012"
}

// let constructorbook = {}
let constructorbook = {
  'StemRootchain.sol': [
    [
      "bytes32",    // subchain name
      "bytes32[]",  // txTreeRoot, BalanceTreeRoot
      "bytes32[]",  // staticnodes
      "uint256",    // creatorDepo
      "address[]",  // op stem account 
      "uint256[]",  // op deposit
      "address[]"   // op seele account
    ],
    [
      "0x416e6e6965", 
      [
        "0x4f2df4a21621b18c71619239c398657a23f198a40a8deff701e340e6e34d0823", 
        "0x4f2df4a21621b18c71619239c398657a23f198a40a8deff701e340e6e34d0823"
      ], 
      [
        "0x1071052039"
      ], 
      "1", 
      [
        "0x0adB61076AF511b8bAdb1264477ba4Be3D302D86",
        "0xfb96c3011d73fecB3F75FFAAac8F02cf83D59298",
        "0xca35b7d915458ef540ade6068dfe2f44e8fa733c", 
        "0x627306090abab3a6e1400e9345bc60c78a8bef57", 
        "0x4b0897b0513fdc7c541b6d9d7e929c4e5364d2db", 
        "0x583031d1113ad414f02576bd6afabfb302140225"
      ], 
      [
        "0",
        "0",
        "100", 
        "100", 
        "100", 
        "100"
      ], 
      [
        "0x0000000000000000000000000000000000000000",
        "0x0000000000000000000000000000000000000000",
        "0x3f78b08f45730f59a15319af41ba5a750021c541", 
        "0x3f78b08f45730f59a15319af41ba5a750021c541", 
        "0x3f78b08f45730f59a15319af41ba5a750021c541", 
        "0x3f78b08f45730f59a15319af41ba5a750021c541"
      ]
    ],
    10000
  ]
}
// console.log();
// console.log(web3.eth.abi.encodeParameters(constructorbook['StemRootchain'][0], constructorbook['StemRootchain'][1]))

let lim   = 6000000
let pri   = '0x58ccd6d932014767b903210377fea81f684e37534cbb765d12529b2882db2a03'
let loud  = true
let block = 3

// Test
var times = 1
test(times)

async function test(times) {
  for ( var i = 1 ; i <= times ; i++ ) {
    console.log(`TEST ROUND ${i} ________`);
    var n = await autodeploy(dir)
    console.log(`result: ${n}\n`);
  }
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
    term(`hash: ${signedTx.Hash}\n`);
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
          .yellow(` send: "${send}"` )
          .green(` fail: ${fail}\n`)
          
          if ( txbh == 'block'
            && send == 'Tx already exists'
            && info >= diff
            && /0x.*/.test(rcbh) ) 
          {
            notyet = false
            resolve(result[3].contract)
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

async function compilepromise(code, solidityPath){
  // setTimeout( function(){
    return new Promise((resolve, reject)=>{ path.join()
      solc = solc.setupMethods(require(solidityPath))
      var input = {language: 'Solidity',sources: {'test.sol': {content: code}},settings: {outputSelection: {'*': {'*': ['*']}}}}
      console.log('Compiling');
      var output = JSON.parse(solc.compile(JSON.stringify(input)))
      console.log('Compiled');
      // console.log(output.errors)
      //if (output.errors) {
      //  reject(JSON.stringify(output.errors))
      //}
      // console.log(output);
      var contracts = []
      for ( contractName in output.contracts['test.sol']){
        var abstract = {
          "contract": contractName+'.sol',
          "payload" : "0x"+output.contracts['test.sol'][contractName].evm.bytecode.object,
          "abi"     : JSON.stringify(output.contracts['test.sol'][contractName].abi),
          "version" : JSON.parse(output.contracts['test.sol'][contractName].metadata).compiler.version
        }
        contracts.push(abstract)
      }
      // console.log(contracts);
      fs.ensureDir(abidir, err => {
        console.log(err) // => null
        var writers = []
        for ( var contract of contracts ) {
          // console.log(contract.abi);
          // var data = new Uint8Array(Buffer.from(contract.abi));
          var data = JSON.parse(contract.abi)
          var name = contract.contract.replace(/\.sol/,'.json')
          var abis = path.join(abidir, name)
          // console.log(abis);
          writers.push(fs.writeJSON( abis, data, {overwrite: true, EOL:'\n', spaces:'\t'}))
        }
        Promise.all(writers).then( () => {
          resolve(contracts)
        })
      })
    })
  // },0)
}

async function contractOrder(dir){
  return new Promise(function(resolve, reject) {
    fs.promises.readdir(dir, { encoding: "utf8" }).then( async (filenames) => {
      var read = []
      for ( var filename of filenames ) {
        var content = await fs.promises.readFile(path.join(dir, filename))
        read.push({
          name    : filename,
          content : content.toString()
        })
      }
      return read
    }).then( async (files) => {
      var dinfo = []
      var combo = ''
      for ( var file of files ) {
        combo += file.content
        var match = file.content.match(/import.*;/g)
        var needs = []
        if ( match != null ) needs = match.map(x => x.match(/[a-zA-Z]*\.sol/g)[0]);
        dinfo.push({ 
          name: file.name, 
          dependencies: needs 
        })
      }

      var sorted = []
      while ( dinfo.length > sorted.length ) {
        for ( var contract of dinfo ) {
          var covered = true
          for ( var dependency of contract.dependencies ) {
            if ( !sorted.includes(dependency) ) {
              covered = false;
            }
          }
          if ( covered && !sorted.includes(contract.name)){ 
            sorted.push(contract.name)
            term
            .nextLine(0)
            .eraseLineAfter()
            .yellow(dinfo.length, '/', sorted.length, ' ');
          }
        }
      }
    
      var combined = `pragma solidity ${ver};\n` + combo.replace(/.*import.*/g,'').replace(/pragma.*;/g,'')
      
      resolve({
        sort: sorted,
        code: combined
      })
    }).catch(err => reject(err))
  })
}

async function autodeploy(dir){
  return new Promise(function(resolve, reject) {
    contractOrder(dir).then( async (contract) => {
      console.log(`Sorted`);
      if (skipCompile) {
        console.log(`Skip compile`);
        return fs.promises.readFile(temp).then( content => {
          return JSON.parse(content.toString());
        })
      } else {
        return compilepromise(contract.code, sol).then( output => {
          fs.writeJsonSync(temp, { output: output, order: contract.sort})
          return {
              output: output,
              order:  contract.sort 
          };
        })
      }
    }).then( async (info) => {
      if ( skipDeploy ) {
        resolve('Skip deploy')
        return 
      }
      for ( var contract of info.order ) {
        var data = findByField(info.output, 'contract', contract)
        var payloadcomplete = data.payload.replace(/__test.sol:[a-zA-Z]*_*/g, function(x){
          var name = x.slice(11).replace(/_*/g, '') + '.sol'
          return addressbook[name].slice(2)
        })
        
        var amount    = 0
        if (constructorbook[contract] != undefined) {
          var constructor = web3.eth.abi.encodeParameters(constructorbook[contract][0], constructorbook[contract][1]).slice(2)
          payloadcomplete += constructor
          amount = constructorbook[contract][2];
        }
        
        if (addressbook != undefined && addressbook[contract] != undefined ) {
          console.log(`Skip ${contract}`);
          continue;
        }
        
        console.log(`Deploy ${contract}`);
        var load      = payloadcomplete
        var from      = sle.offline.key.pubof(pri)
        var to        = '0x0000000000000000000000000000000000000000'
        var price     = 0
        var diff      = block
        var receipt  = await mustSend(pri, from, to, amount, lim, price, load, loud, diff)
        console.log(`"${contract}": "${receipt}" \n`);
        // use receipt to fill the addressbook
        addressbook[contract] = receipt
      }
      resolve('complete')
    }).catch( err => {
      // console.log('abort transaction');
      console.log(new Error(err));
    })
  });
}

function findByField(list, field, name){
  for ( var item of list ) {
    if (item[field] == name ) {
      return item
    }
  }
}