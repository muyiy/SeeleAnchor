// let solc = require('solc');

// compile(code, contractName, version){
//   solc = solc.setupMethods(require(`./solc/${version}`))
//   var input = {language: 'Solidity',sources: {'test.sol': {content: code}},settings: {outputSelection: {'*': {'*': ['*']}}}}
//   var output = JSON.parse(solc.compile(JSON.stringify(input)))
//   return {
//     "payload": "0x"+output.contracts['test.sol'][contractName].evm.bytecode.object,
//     "abi": output.contracts['test.sol'][contractName].abi,
//     "version": JSON.parse(output.contracts['test.sol'][contractName].metadata).compiler.version
//   }
// }

// compilepromise(code, version){
//   return new Promise((resolve, reject)=>{
//     solc = solc.setupMethods(require(`./solc/${version}`))
//     var input = {language: 'Solidity',sources: {'test.sol': {content: code}},settings: {outputSelection: {'*': {'*': ['*']}}}}
//     var output = JSON.parse(solc.compile(JSON.stringify(input)))
//     if (output.errors) reject(output.errors)
//     resolve(output)
//   })
// }