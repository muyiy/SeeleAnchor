const createKeccakHash  = require('keccak')    // for hashing
const RLP               = require('rlp')       // for serialization
const { randomBytes }   = require('crypto')
const secp256k1         = require('secp256k1') // for elliptic operations
const keyfile           = require('./keyfile')
let shardnum = 4

// console.log(keyfile);
module.exports = {
  key: {
    spawn : generateKeypairByShard,
    shard : shardOfPub,
    pubof : publicKeyOf
  },
  keyfile: keyfile,
  tx: {
    sign: signTx,
    init: initTx
  }
}

async function constructor(keyfileDir) {
    this.keyfileDir = keyfileDir || '~/.anchor';
  }
  
function initTx(pubkey, to, amount, payload){
    //verify pubkey, to, amount, payload?
    return {
          "Type":         0,
          "From":         pubkey,
          "To":           to,
          "Amount":       amount,
          "AccountNonce": 0,
          "GasPrice":     1,
          "GasLimit":     0,
          "Timestamp":    0,
          "Payload":      payload
    }
  }
  
function signTx(prikey, tx){
  // check validity 
  var infolist = [
    tx.Type,
    tx.From,
    tx.To,
    tx.Amount,
    tx.AccountNonce,
    tx.GasPrice,
    tx.GasLimit,
    tx.Timestamp,
    tx.Payload
  ]
  
  var hash = "0x"+createKeccakHash('keccak256').update(RLP.encode(infolist)).digest().toString('hex')
  var signature = secp256k1.sign(Buffer.from(hash.slice(2), 'hex'), Buffer.from(prikey.slice(2), 'hex'))
  var sign = Buffer.concat([signature.signature,Buffer.from([signature.recovery])]).toString('base64')
  var Data = tx
  var txDone = {
    "Hash": hash,
    "Data": Data,
    "Signature": {
      "Sig": sign,
    }
  }
  return txDone
}
  
async function validPub(pubkey){
    if (!(/^(0x)?[0-9a-f]{40}$/.test(pubkey) || /^(0x)?[0-9A-F]{40}$/.test(pubkey))) {
      return false;
    } 
    return true
  }
  
async function txValidity(tx){
    if (typeof tx.to !== 'string' || tx.to.length!=42 || tx.to.slice(0,2)!="0x"){
      throw "invalid receiver address, should be of length 42 with prefix 0x"
      return false
    }
    if (typeof tx.payload !== 'string'){
      throw "invalid payload"
      return false
    }
    if (typeof tx.nonce !== 'number' || tx.nonce < 0) {
      console.log(typeof tx.nonce)
      throw "invalid nonce" 
      return false
    }
    if (typeof tx.amount !== 'number' || tx.amount < 0) {
      console.log(typeof tx.amount)
      throw "invalid amount" 
      return false
    }
    if (typeof tx.price !== 'number' || tx.price < 0) {
      console.log(typeof tx.price)
      throw "invalid price" 
      return false
    }
    if (typeof tx.limit !== 'number' || tx.limit < 0) {
      console.log(typeof tx.limit)
      throw "invalid limit" 
      return false
    }
    return true
    
    //nonce, amount, price and limit must be positive integers
  }
  
function publicKeyOf(privateKey){
    if (privateKey.length!=66){throw "privatekey string should be of lenth 66"} 
    if (privateKey.slice(0,2)!="0x"){throw "privateKey string should start with 0x"}
    const inbuf = Buffer.from(privateKey.slice(2), 'hex');
    if (!secp256k1.privateKeyVerify(inbuf)){throw "invalid privateKey"}
    const oubuf = secp256k1.publicKeyCreate(inbuf, false).slice(1);
    var publicKey = createKeccakHash('keccak256').update(RLP.encode(oubuf)).digest().slice(12).toString('hex')
    return "0x"+publicKey.replace(/.$/i,"1")
  }

function shardOfPub(pubkey){
  var sum = 0
  var buf = Buffer.from(pubkey.substring(2), 'hex')
  for (const pair of buf.entries()) {if (pair[0] < 18){sum += pair[1]}}
  sum += (buf.readUInt16BE(18) >> 4)
  return (sum % shardnum) + 1
}
  
function generateKeypair(){
    let privKey
    do { privKey = randomBytes(32) } while (!secp256k1.privateKeyVerify(privKey))
    
    // get the public key in a compressed format
    let pubKey = secp256k1.publicKeyCreate(privKey)
    pubKey = secp256k1.publicKeyConvert(pubKey, false).slice(1)

    // Only take the lower 160bits of the hash
    let address = createKeccakHash('keccak256').update(RLP.encode(pubKey)).digest().slice(-20)
    address[19] = address[19]&0xF0|1
    
    return {
        "publicKey" : "0x" + address.toString('hex'),
        "privateKey" : "0x" + privKey.toString('hex'),
    }
}

function generateKeypairByShard(shard){
  let keypair
  if ( /^[1-4]$/.test(shard) ) {
    do{
      keypair = generateKeypair()
    } while (shardOfPub(keypair.publicKey) != shard)
    return keypair
  } else {
    return generateKeypair()
  }
}
