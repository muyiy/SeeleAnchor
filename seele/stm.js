const sle   = require('./seele')
const term  = require( 'terminal-kit' ).terminal
// console.log(sle);
let node  = [ 0, 'http://127.0.0.1:8030', 'http://117.50.97.136:8038', 'http://104.218.164.77:8039', 'http://117.50.97.136:8036']
let pri   = '0xaf733a2bb645dc095ae4804454de592f219e858f76b1dbaaa5fe6500b4cabf9d'
let frm   = '0x7460dde5d3da978dd719aa5c6e35b7b8564682d1'
let to    = '0x7460dde5d3da978dd719aa5c6e35b7b8564682d1'
let amt   = 1000000
let lim   = 210000
let gas   = 0
let load  = ''
let diff  = 5
let loud  = true

test()

async function test(){
  // var rpc = new sle.rpcjson(node[1],1)
  var result = await mustSend(pri, frm, to, amt, lim, gas, load, loud, diff)
  console.log(result);
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
          
          setTimeout( ()=>{
            time = Date.now()
            term
            // .previousLine(1)
            // .eraseLineAfter()
            .cyan(parseInt((time - bgin)/1000), 's :')
            .white( `status: ${txbh}`)
            .blue(` depth: ${info}/${diff}`)
            .green(` receipt: ${rcbh}`)
            .yellow(` send: ${send}` )
            .green(` fail: ${fail}\n`)
          }, 1000)
          
          
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