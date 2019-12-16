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
    make: makeKeyfile
  },
  account: {
    load: loadAccounts,
    save: saveAccounts,
    drop: dropAccounts
  }
}

async function loadAccounts(){
  return new Promise(function(resolve, reject) {

  });
}

async function saveAccounts(list){
  return new Promise(function(resolve, reject) {
    var valid = []
    var wrong = []
    for ( var account of list ) {

    }

    if (valid.length == 0) {
      return reject(`not valid ${wrong}`)
    }

    // const insert   = `INSERT INTO nodes(network, number, address, parentNetwork) VALUES ${valid.join(',')};`
    // const create   = `CREATE TABLE IF NOT EXISTS nodes( network TEXT NOT NULL, parentNetwork TEXT NOT NULL, address TEXT NOT NULL, number INTEGER NOT NULL, unique(address) );`
    // console.log(insert);
    var db = new sqlite3.Database(paths.acdb, (err) => {
      if (err) {
        return reject(new Error(err))
      } else {
        console.log('DB: Connected!');
      }
    });

    db.run(create, (err) => {
      if (err) {
        return reject(new Error(err))
      } else {
        console.log('DB: Table Accessible');
      }

      db.run(insert, (err) => {
        if (err) {
          reject(new Error(err))
        }

        console.log(`DB: Insert ${this.lastID}`);
        db.close((err) => {
          if (err) {
            reject(new Error(err))
            return;
            // reject('allfake')
          }
          console.log('DB: Closed');
          resolve('addaccounts')
        });
      });
    })

  });
}

async function dropAccounts(){
  return new Promise(function(resolve, reject) {

  });
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
  fs.readdir(paths.account).then( nets => {
    console.log(nets);
    // var keyfiles = {}
    // for ( var net of nets ) {
    //   // keyfiles[net] =
    //   // path.join(paths.account, )
    //   var netpath = path.join(paths.account, net)
    //   fs.readdir(netpath).then( keys => {
    //     // console.log(keys);
    //     for ( var key of keys ) {
    //       var keypath = path.join(netpath, key)
    //       fs.readdir(keypath)
    //       // keyfiles[net][key] = {
    //       //   name: fs.readdir()[0]
    //       //   file:
    //       // }
    //     }
    //   })
    // }
  });
}

async function makeKeyfile(item){
  return new Promise(function(resolve, reject) {
    var dst = path.join(paths.account, item.net, item.file.address)
    var name = item.name
    console.log(item);
    console.log(dst);
    fs.pathExists(dst).then( exists => {

      if ( exists ) {
        // console.log();
        reject(`${item.file.address} already exists in ${item.net} network`)
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
      console.log(node);
      if (  types.isChainName(node[0]) && /^[0-4]$/.test(node[1]) && types.isIpport(node[2]) ) {
        valid.push(`("${node[0]}","${node[1]}","${node[2]}","${node[3]}")`)
      } else {
        wrong.push(node)
      }
    }

    if (valid.length == 0) {
      return reject(`not valid ${wrong}`)
    }

    const insert   = `INSERT INTO nodes(network, number, address, parentNetwork) VALUES ${valid.join(',')};`
    const create   = `CREATE TABLE IF NOT EXISTS nodes( network TEXT NOT NULL, parentNetwork TEXT NOT NULL, address TEXT NOT NULL, number INTEGER NOT NULL, unique(address) );`
    // console.log(insert);
    var db = new sqlite3.Database(paths.ipdb, (err) => {
      if (err) {
        return reject(new Error(err))
      } else {
        console.log('DB: Connected!');
      }
    });

    db.run(create, (err) => {
      if (err) {
        return reject(new Error(err))
      } else {
        console.log('DB: Table Accessible');
      }

      db.run(insert, (err) => {
        if (err) {
          reject(new Error(err))
        }

        console.log(`DB: Insert ${this.lastID}`);
        db.close((err) => {
          if (err) {
            reject(new Error(err))
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
  return new Promise(function(resolve, reject) {
    var db = new sqlite3.Database(paths.ipdb, (err) => {
      if (err) {
        return reject(new Error(err))
      } else {
        console.log('DB: Connected!');
      }
    });
    var deleteNodes = 'DELETE FROM nodes WHERE'
    if ( list.length == 1 ) {
      deleteNodes += `
      network = "${list[0][0]}"
      AND number = ${list[0][1]}
      AND address = "${list[0][2]}"
      AND parentNetwork = "${list[0][3]}";`
    } else {
      reject(new Error('Nodes don\'t support multiple drop yet'))
    }

    console.log(deleteNodes);
    db.run(deleteNodes, (err)=>{
      if (err) {
        reject(new Error(err))
      } else {

      }


      db.close((err) => {
        if (err) {
          reject(new Error(err));
          return;
        }
        console.log('DB: Closed');
        resolve('dropNodes')
      });
    })
  });
}

async function loadNodes(){
  // var result = await saveNodes(nodelist)
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
        db.close((e)=>{
          if (e) reject(e)
          else {
            console.log('DB: Closed!');
            resolve(rows)
          }
        })
      });
  })
}
