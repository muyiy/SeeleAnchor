const fs        = require('fs');
const path      = require("path")
const util      = require('util')
const exist   = util.promisify(fs.access)
const read    = util.promisify(fs.readFile)

function i18n(dictionary){
  this.dictionary = dictionary
  return function(phrase){
    let translation = this.dictionary[phrase];
    if(translation === undefined) {
         translation = phrase;
         console.log(phrase, ": not translated");
    }
    return translation;
  }
}

function slang(l){
  return new Promise((resolve, reject)=>{
    const defaultPath = path.join(__dirname, `EN.json`);
    const loadingPath = path.join(__dirname, `${l}.json`);
    
    exist(loadingPath).then( () => {
      read(loadingPath).then( (data) => {
        this._dictionary = JSON.parse(data.toString())
        resolve(i18n(JSON.parse(data.toString())));
      }).catch( (err) => {console.log(err); reject(err) })
    }).catch( (err) => {
      console.log(`${l} not found, fall back to EN`);
      this._lang = 'EN'
      read(defaultPath).then( (data) => {
        this._dictionary = JSON.parse(data.toString())
        resolve(i18n(JSON.parse(data.toString())));
      }).catch( (err) => {console.log(err); reject(err) })
    })
  })
}

module.exports = slang

// slang('CN').then((_)=>{
//   console.log(_('Version'));
// }).catch( (err)=>{console.log(err)})

