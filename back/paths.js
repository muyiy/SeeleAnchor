var os    = require("os");
var fs    = require('fs');

const root      = os.homedir() + "/.seeleAnchor";
const config    = root + "/config.json";
const ipdb      = root + "/ip.db"
const txdb      = root + "/tx.db"
const evdb      = root + "/ev.db"
const contract  = root + "/contract/" 
const account   = root + "/account/" 

function syncmkp(path){
  if (!fs.existsSync(path)){
    fs.mkdirSync(path, { recursive: true }, (err) => {if (err) throw err;})
  }
}

function initiate(){
  syncmkp(contract)
  syncmkp(account)
  
  if (!fs.existsSync(config)) {
    console.log('copy config template to root from', __dirname );
    fs.copyFileSync(__dirname+'/config.json', config);
  }
}

module.exports = {
    initiate  : initiate,
    root      : root, 
    config    : config, 
    ipdb      : ipdb, 
    txdb      : txdb, 
    evdb      : evdb, 
    contract  : contract, 
    account   : account
}