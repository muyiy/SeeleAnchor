const seeleJSONRPC  = require('./jsonrpc')
const seeleOFFLINE  = require('./offline')
// console.log(seeleOFFLINE);

module.exports = {
  offline: seeleOFFLINE,
  rpcjson: seeleJSONRPC
}

// client = new seeleJSONRPC('http://117.50.97.136:18037')
// console.log(client);
// client.getInfo().then( (data)=>{
//   console.log(data);
// }).catch((err)=>{
//   console.log(err);
// })
