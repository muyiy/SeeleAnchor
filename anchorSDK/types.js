module.exports = {
  isJSON: isObject,
  isChainName: isChainName,
  isIpport: isIpport,
  isKeyfile: isKeyfile,
  filename: filename,
  shardOfpub: shardOfpub
}

function isObject(obj){
  return obj !== undefined && obj !== null && obj.constructor == Object;
}

function isIpport(ipport){
  return /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]):((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/.test(ipport)
  
}

function isChainName(name){
  return /^[a-zA-Z]*$/.test(name)
}

function isKeyfile(filecontents){
  if (isObject(filecontents)){
    if(filecontents.version != 1) { return false; }
    if(!/^[0-9a-z]{64,64}$/.test(filecontents.crypto.ciphertext)){ return false; }
    if(!/^[0-9a-z]{32,32}$/.test(filecontents.crypto.iv)){ return false; }
    if(!/^[0-9a-z]{64,64}$/.test(filecontents.crypto.salt)){ return false; }
    if(!/^0x[0-9a-z]{64,64}$/.test(filecontents.crypto.mac)){ return false; }
    else return true
  }
  return false
}

function filename(str){
  return str.split('\\').pop().split('/').pop();
}

function shardOfpub(pubkey){
  var shardnum = 4
  var sum = 0
  var buf = Buffer.from(pubkey.substring(2), 'hex')
  for (const pair of buf.entries()) {if (pair[0] < 18){sum += pair[1]}}
  sum += (buf.readUInt16BE(18) >> 4)
  return (sum % shardnum) + 1
}

