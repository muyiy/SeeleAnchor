const scrypt            = require("scrypt-js")
const createKeccakHash  = require('keccak')  // for hashing
var RLP                 = require('rlp')                    // for serialization
var secp256k1           = require('secp256k1')        // for elliptic operations

const version     = 1
const	ScryptN     = 1 << 18
const	ScryptP     = 1
const	scryptR     = 8 
const scryptDKLen = 32

module.exports = {
  open: decryptKeyfile,
  lock: encryptKeyfile
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

// let keyfilejson1 = {
//         "version": 1,
//         "address": "0x7138389b1c05387d982cf803d24a383a4e133921",
//         "crypto": {
//                 "ciphertext": "87b3b40923d3af2681cc3655e5fcd2a057354c073188a7e11dadba35856888f7",
//                 "iv": "c20fabe77223b36f48c35c2614f73b5d",
//                 "salt": "07bc50a56fd225ad3410c5a780f0dfb9a0cd0034844a57250cb44b7a7077ac66",
//                 "mac": "0xdd5b832e058ed864d4fb5f720177ca5b6ad9238f6628c30d0d2bacf314b77981"
//         }
// }
// let keyfilejson = {
// 	"version": 1,
// 	"address": "0x7138389b1c05387d982cf803d24a383a4e133921",
// 	"crypto": {
// 		"ciphertext": "9af131eca4e6be86870d9f5af000361a1a9be12efec3474fb96d9fc035ad2087",
// 		"iv": "ceb495f6230bfa56c3484998521a9b48",
// 		"salt": "b1ee83db2d442b300fa747fb8b5a5e7cb1ace4fd576804fec6e08e9fdcf216fe",
// 		"mac": "0x6023ebacd5f51530da5fc2efb6d22585dacff794c11ccc2aa2284104d6b9de37"
// 	}
// }
// 
// let pass = '123'
// let privatekey = "0x79cbf2f9cd3f055f7397dac76487638c11f56deaedee347e97e43ab80ea3a3f3"
// decryptKeyfile(keyfilejson, pass)
// encryptKeyfile(privatekey, pass)


