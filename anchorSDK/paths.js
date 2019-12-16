const os    = require('os');
const path  = require('path');
const fs    = require('fs-extra');

const srcConfig = path.join(__dirname, 'rsc', 'config.json')
const home      = os.homedir()
const root      = path.join(home , ".seeleAnchor")
const config    = path.join(root , "config.json")
const nddb      = path.join(root , "nd.db")
const scdb      = path.join(root , "sc.db")
const acdb      = path.join(root , "ac.db")
const ipdb      = path.join(root , "ip.db")
const txdb      = path.join(root , "tx.db")
const evdb      = path.join(root , "ev.db")
const contract  = path.join(root , "contract" )
const account   = path.join(root , "account" )

module.exports = {
    initiate  : initiate,
    root      : root,
    config    : config,
    nddb      : nddb,
    ipdb      : ipdb,
    scdb      : scdb,
    acdb      : acdb,
    txdb      : txdb,
    evdb      : evdb,
    contract  : contract,
    account   : account
}

async function initiate(){
  return new Promise(function(resolve, reject) {
    Promise.all([
      fs.ensureDir(contract),
      fs.ensureDir(account),
      fs.copy(srcConfig, config, { overwrite: true, errorOnExist: false})
    ]).then(function(values) {
      console.log('paths: initation complete');
      resolve(values)
    }).catch( err => {console.log(err);})
  });

}
