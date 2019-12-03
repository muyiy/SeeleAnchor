var sqlite3 = require('sqlite3').verbose();
const fs    = require('fs-extra');
const path  = require('path');
const paths = require('./paths');
const types = require('./types');

module.exports = {
  settings: {
    load: loadSettings,
    save: saveSettings
  },
  nodes: {
    load: loadNodes,
    save: saveNodes,
    drop: dropNodes
  },
  keyfile: {
    load: loadKeyfiles,
    save: saveKeyfiles,
    drop: dropKeyfiles,
    back: backKeyfiles,
    make: makeKeyfile,
  }
}

async function loadSettings(){
  var init = await paths.initiate()
  return new Promise((resolve, reject)=>{
    fs.readJson(paths.config).then(settings => {
      resolve(settings)
    }).catch(err => {
      console.error(err)
    });
  })
}

async function saveSettings(settings){
  return new Promise(function(resolve, reject) {
    switch (settings.lang) {
      case 'EN': break;
      case 'CN': break;
      default:
        reject('settings: invalid lang')
        return;
    }
    
    switch (settings.theme) {
      case 'dark': break;
      case 'light': break;
      default:
        reject('settings: invalid theme')
        return;
    }
    
    const data = new Uint8Array(Buffer.from(JSON.stringify(settings)));
    fs.writeJson(paths.config, data, { EOL:'\n', spaces:'\t' }, (err) => {
      if (err) reject(err);
      resolve('saved')
      console.log('Settings Saved');
    }) ;
  });
}

async function loadKeyfiles(){
  
}

async function makeKeyfile(item){
  return new Promise(function(resolve, reject) {
    var dst = path.join(paths.account, item.net, item.file.address)
    var name = item.name
    console.log(item);
    console.log(dst);
    fs.pathExists(dst).then( exists => {
      console.log(exists);
      if ( exists ) {
        reject(`${item.file.address} exists in ${item.net}`)
      } else {
        console.log('going to make file');
        fs.ensureFile(path.join(dst, name)).then( ()=>{
          fs.writeJson(path.join(dst, name), item.file, { overwrite: true, EOL:'\n', spaces:'\t' }).then(result => {
            resolve(`${name} added`)
          }).catch( err => {
            reject(err)
          })
        })        
      }
    }).catch( err=> {
      console.log(err);
    })
  });
}

async function saveKeyfiles(paths){
  return new Promise(function(resolve, reject) {
    for (var i = 0; i < paths.length; i++) {
      // paths[i]
    }
  });
}

async function backKeyfiles(paths){
}

async function dropKeyfiles(paths){
  
}

async function moveKeyfiles(paths, dst){
  
}

async function saveNodes(list){
  return new Promise( (resolve, reject) => {
    // preparing array of sqlite statements
    var valid = []
    var wrong = []
    for ( var node of list ) {
      if (  types.isChainName(node[0]) && /^[0-4]$/.test(node[1]) && types.isIpport(node[2]) ) {
        valid.push(`("${node[0]}","${node[1]}","${node[2]}")`)
      } else {
        wrong.push(node)
      }
    }
    const insert   = `INSERT INTO nodes(net, status, ipport) VALUES ${valid.join(',')};`
    const createDB = `CREATE TABLE IF NOT EXISTS nodes( ipport TEXT NOT NULL, net TEXT NOT NULL, status int NOT NULL, unique(ipport, net, status) )`
    
    var db = new sqlite3.Database(paths.ipdb, (err) => {
      if (err) {
        resolve(err);
      } else {
        console.log('DB: Connected!'); 
      }
    });
    
    db.run(createDB, (err) => {
      if (err) {
        resolve(err);
      } else {
        console.log('DB: Table Accessible');
      }
    
      db.run(insert, function(err) {
        if (err) {
          resolve(err);
        }

        console.log(`DB: Insert ${this.lastID}`);
        db.close((err) => {
          if (err) {
            resolve(err);
            return;
            // reject('allfake')
          }
          console.log('DB: Closed');
          resolve('addnodes')
        });
      });
    
    })
  })
}

async function dropNodes(list){
  
}

async function loadNodes(){
  var result = await saveNodes(nodelist)
  // console.log(result);
  
  return new Promise( (resolve, reject) => {
      var db = new sqlite3.Database(paths.ipdb, (err) => {
        if (err) {
          reject(err.message);
        } else {
          console.log('DB: Connected!'); 
        }
      });
      
      var selectall = 'SELECT * FROM nodes;'
      
      db.all(selectall, [], (err, rows) => {
        if (err) {
          throw err;
        }
        
        resolve(rows)
      });
  })
}

let nodelist = [
  ["Seele", "1", "117.50.97.136:18037"],
  ["Seele", "2", "117.50.97.136:8038"],
  ["Seele", "3", "104.218.164.77:8039"],
  ["Seele", "4", "117.50.97.136:8036"],
  ["Seele", "0", "117.50.97.136:8037"],
  ["Seele", "0", "107.150.102.94:8038"],
  ["Seele", "0", "104.218.164.77:8039"],
  ["Seele", "0", "106.75.85.9:8037"],
  ["Seele", "0", "117.50.11.129:8036"],
  ["Seele", "0", "117.50.38.63:8036"],
  ["Seele", "0", "107.150.96.231:8037"],
  ["Seele", "0", "107.150.103.125:8039"],
  ["Seele", "0", "104.218.164.169:8037"],
  ["Seele", "0", "104.218.164.124:8039"],
  ["Seele", "0", "104.218.164.193:8036"],
  ["Seele", "0", "104.218.164.27:8037"],
  ["Seele", "0", "106.75.90.237:18037"],
  ["Seele", "0", "107.150.105.10:8037"],
  ["SoloChain", "1", "107.150.105.10:8037"],
  ["SoloChain", "0", "104.218.164.193:8036"],
  ["SoloChain", "0", "104.218.164.27:8037"],
  ["SoloChain", "0", "106.75.90.237:18037"],
  ["SoloChain", "0", "107.150.105.10:8037"],
  ["HipHopChain", "1", "107.150.105.10:8037"],
  ["HipHopChain", "0", "104.218.164.193:8036"],
  ["HipHopChain", "0", "104.218.164.27:8037"],
  ["HipHopChain", "0", "106.75.90.237:18037"],
  ["HipHopChain", "0", "107.150.105.10:8037"]
]

let keylist = [
  path.join(__dirname , "test", "Matthew"),
  path.join(__dirname , "test", "Mark"),
  path.join(__dirname , "test", "Luke"),
  path.join(__dirname , "test", "John")
]

// uncomment below and run node io_settings.js
// loadSettings().then((settings)=>{
//   var saving = JSON.parse(JSON.stringify(settings));
//   saving.lang="CN"
//   saving.theme="white"
//   return saveSettings(saving)
// }).catch((err)=>{
//   console.log(err);
// })
