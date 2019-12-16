const { randomBytes }   = require('crypto')
const scrypt            = require("scrypt-js")
const createKeccakHash  = require('keccak')    // for hashing
const RLP               = require('rlp')       // for serialization
const secp256k1         = require('secp256k1') // for elliptic operations
const Web3              = require('web3');
var web3 = new Web3

const shardnum    = 4
const version     = 1
const	ScryptN     = 1 << 18
const	ScryptP     = 1
const	scryptR     = 8
const scryptDKLen = 32


// console.log(keyfile);
module.exports = {
  sub: {
    key: {
      spawn : generateKeypairSub,
      pubof : publicKeyOfSub
    },
    keyfile: {
      open: decryptKeyfileSub,
      lock: encryptKeyfileSub
    }
  },
  key: {
    spawn : generateKeypairByShard,
    shard : shardOfPub,
    pubof : publicKeyOf
  },
  keyfile: {
    open: decryptKeyfile,
    lock: encryptKeyfile
  },
  tx: {
    sign: signTx,
    init: initTx
  }
}


function randHex(len) {
  var maxlen = 8,
      min = Math.pow(16,Math.min(len,maxlen)-1)
      max = Math.pow(16,Math.min(len,maxlen)) - 1,
      n   = Math.floor( Math.random() * (max-min+1) ) + min,
      r   = n.toString(16);
  while ( r.length < len ) {
     r = r + randHex( len - maxlen );
  }
  return r;
};

function decryptKeyfileSub(keyfile, pass, html){}

function encryptKeyfileSub(private, pass, html){}
// THIS
async function decryptKeyfile(keyfile, pass, html) {
  //check version
  if ( keyfile.version!= version ) {
    throw 'error: keyversion mistmatch'
  }

  try {
    const mac = keyfile.crypto.mac
    const ciphertext = Buffer.from(keyfile.crypto.ciphertext,'hex')
    const iv = Buffer.from(keyfile.crypto.iv,'hex')
    const salt = Buffer.from(keyfile.crypto.salt,'hex')
    const bpass = Buffer.from(pass,'utf8')

    let scryptKey = []
    scrypt(bpass, salt, ScryptN, scryptR, ScryptP, scryptDKLen, function(error, progress, key) {
        if (error) {
          console.log("Error: " + error);
        } else if (key) {
          // console.log("Found: " + key);
          const crypto = require('crypto');
          const decipher = crypto.createDecipheriv('aes-128-ctr', Buffer.from(key.slice(0,16)), iv)
          var res = decipher.update(ciphertext,'utf8','hex')
          const oubuf = secp256k1.publicKeyCreate(Buffer.from(res,'hex'), false).slice(1);
          var publicKey = createKeccakHash('keccak256').update(RLP.encode(oubuf)).digest().slice(12).toString('hex')
          var pubk = "0x"+publicKey.replace(/.$/i,"1")
          var prik = "0x"+res.toString('hex')
          const keypair = {
            "privateKey":prik,
            "publicKey":pubk
          }
          console.log(keypair);
        } else {
          // update UI with progress complete
          // console.log(progress.toFixed(2)*100,"%");
        }
      })
  } catch(e) {
    throw e
  }
}
// THIS
async function encryptKeyfile(private, pass, html) {
  return new Promise(function(resolve, reject) {
    const salt = randHex(64)
    const iv = randHex(32)
    const passb = Buffer.from(pass,'utf8')
    const saltb = Buffer.from(salt, 'hex')
    const ivb = Buffer.from(iv,"hex")

    scrypt(passb, saltb, ScryptN, scryptR, ScryptP, scryptDKLen, function(error, progress, key) {
        if (error) {
          console.log("Error: " + error);
        } else if (key) {
          // console.log("Found: " + key);
          const crypto = require('crypto');
          prib = Buffer.from(private.slice(2),'hex')
          const cipher = crypto.createDecipheriv('aes-128-ctr', Buffer.from(key.slice(0,16)), ivb)
          var ciphertx = cipher.update(prib,'utf8','hex')
          const p1 = Buffer.from(key.slice(16,32))
          const p2 = Buffer.from(ciphertx,'hex')
          const mac = "0x"+createKeccakHash('keccak256').update(p1).update(p2).digest().toString('hex')
          const oubuf = secp256k1.publicKeyCreate(prib, false).slice(1);
          var publicKey = createKeccakHash('keccak256').update(RLP.encode(oubuf)).digest().slice(12).toString('hex')
          const pubk = "0x"+publicKey.replace(/.$/i,"1")

          const keyfile = {
                  "version": version,
                  "address": pubk,
                  "crypto": {
                          "ciphertext": ciphertx,
                          "iv": iv,
                          "salt": salt,
                          "mac": mac
                  }
          }
          // console.log(keyfile);
          resolve(keyfile)
        } else {
          // update UI with progress complete
          // console.log(progress);
          console.log(parseInt(progress*100).toString(),"%");
        }
      })

  });
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
// THIS
function publicKeyOfSub(privateKey){
  return web3.eth.accounts.privateKeyToAccount(privateKey).address
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

//THIS
function generateKeypairSub(){
  let privKey
  do { privKey = randomBytes(32) } while (!secp256k1.privateKeyVerify(privKey))
  var privateKey = "0x" + privKey.toString('hex')

  return {
    "publicKey" : publicKeyOfSub(privateKey),
    "privateKey" : privateKey,
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
