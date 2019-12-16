var sqlite3 = require('sqlite3').verbose();
const fs    = require('fs-extra');
const path  = require('path');
const paths = require('./paths');
const types = require('./types');

let isvalid = {
  account     : isvalidAccount,
  transaction : isvalidTransaction,
  relay       : isvalidRelay,
  request     : isvalidRequest,
  subchain    : isvalidSubhcain,
  node        : isvalidNode,
}

class SQ {
  constructor(
    name,
    path,
    fields,
    structure
  ){
    this.name = name
    this.path = path
    this.fields = fields
    this.create = `CREATE TABLE IF NOT EXISTS ${name} ${structure};`
    this.insert = `INSERT INTO ${name}${fields} VALUES`
    this.select = `SELECT FROM ${name} WHERE`
  }

  async save(list){
    var name = this.name
    var path = this.path
    var fields = this.fields
    var create = this.create
    var insert = this.insert
    var select = this.select
    return new Promise(function(resolve, reject) {
      console.log(list);
      var valid = []
      var wrong = []
      for ( var entry of list ) {
        if ( isvalid[name](entry) ) {
          valid.push(entry)
        } else {
          wrong.push(entry)
        }
      }
      // console.log(valid);
      if (valid.length == 0) {
        return reject(`not valid ${wrong}`)
      }

      const insertcmd   = `${insert} ${valid.join(',')};`
      console.log(insertcmd);

      var db = new sqlite3.Database(path, (err) => {
        if (err) {
          return reject(new Error(err))
        } else {
          console.log(`${name}DB: Connected`);
        }
      });

      db.run(create, (err) => {
        if (err) {
          reject(new Error(err))
        } else {
          console.log(`${name}DB: Accessible`);
        }

        db.run(insertcmd, (err) => {
          if (err) {
            reject(new Error(err))
          }

          // console.log(this);
          // console.log(`${name}DB: insert ${this.lastID}`);
          db.close((err) => {
            if (err) {
              reject(new Error(err))
              return;
              // reject('allfake')
            }
            console.log(`${name}DB: Closed`);
            return resolve(`${name} save complete`);
          });
        });
      })
    });
  }

  async drop(condition){
    var name = this.name
    var path = this.path
    var fields = this.fields
    var create = this.create
    var insert = this.insert
    var select = this.select
    return new Promise(function(resolve, reject) {
      var db = new sqlite3.Database(path, (err) => {
        if (err) {
          return reject(new Error(err))
        } else {
          console.log(`${name}DB: Connected!`);
        }
      });

      var deleteNodes = `DELETE FROM ${name} WHERE ${condition};`

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
          console.log(`${name}DB: Closed`);
          resolve(`${name}DB: delete complete`)
        });
      })
    });
  }

  async load(condition){
    var name = this.name
    var path = this.path
    var fields = this.fields
    var create = this.create
    var insert = this.insert
    var select = this.select
    return new Promise( (resolve, reject) => {
        var db = new sqlite3.Database(path, (err) => {
          if (err) {
            reject(err.message);
          } else {
            console.log(`${name}DB: Connected!`);
          }
        });

        var selectall = `SELECT * FROM ${name} WHERE ${condition};`

        db.all(selectall, [], (err, rows) => {
          if (err) {
            throw err;
          }
          db.close((e)=>{
            if (e) reject(e)
            else {
              console.log(`${name}DB: Closed!`);
              resolve(rows)
            }
          })
        });
    })
  }
}

module.exports = {
  node: new SQ(
    'node',
    paths.nddb,
    `( network, parentNetwork, address, number )`,
    `( network TEXT NOT NULL, parentNetwork TEXT NOT NULL, address TEXT NOT NULL, number INTEGER NOT NULL, unique(address) )`
  ),
  account: new SQ(
    "account"
  ),
  transaction: new SQ(
    "transaction"
  ),
  relay: new SQ(
    "relay"
  ),
  request: new SQ(
    "request"
  ),
  subchain: new SQ(
    "subchain",
    paths.scdb,
    `( network, address )`,
    `( network TEXT NOT NULL, address TEXT NOT NULL, unique(network))`
  )
}

console.log("accounts");

function isvalidNode(entry) { return true }

function isvalidAccount(entry){  return true }

function isvalidTransaction(entry){  return true }

function isvalidRelay(entry){  return true }

function isvalidRequest(entry){  return true }

function isvalidSubhcain(entry){  return true }
