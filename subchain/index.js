deposit 
exit: 
relay: api > c.relay
challenge: 
respond

var constructor = {
  subchainName: name,
  staticNodes: nodes,
  creatorDeposit: amount,
  operatorAccounts: op[],
  operatorDeposites: op[],
  seeleAccounts: op[]
}

var subTX = {
  Hash: hash, //bytes32
  Data: [
    tx.Type, //// identity,  
    tx.From, //address
    tx.To, //address
    tx.Amount, //uint256
    tx.AccountNonce, //uint256
    tx.GasPrice, //uint256
    tx.GasLimit, //uint256
    tx.Timestamp,
    tx.Payload, 
    TN.txHashForStem,//byte32 
    TN.txSignatureForStem, //bytes
  ],
  Signature : { 
    Sig : sign, //txSignature
  }
}


  