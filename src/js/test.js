// const { paths, io } = require('anchorsdk')
// const sle = require('seele')

var test = 'web3key'

var name = 'Key'
var net  = 'Seele'
var prik = '0x326911abeb06942294fe325d0b09873d5c2f7fec72756b8355dae30a4372470d'
var pubk = '0x96d281b1ed9dd36cbe9537a902e11bf26ae1fef1'

switch (test) {
  case 'web3key':
    break;
  case 'save-keyfile-shard':
    console.log('yes');
    var a = async ()=>{
      await sle.offline.keyfile.lock(
        sle.offline.key.spawn(1).privateKey,
        '123'
      ).then( async (keyfile) => {
        return io.keyfile.make({
          name: name,
          net: net,
          file: keyfile
        })
      }).catch( err => { 
        console.log(err); 
      })
      
      console.log('Generate from shard');
    }
    a()
    break;
  case 'save-keyfile-privatekey':
    var a = async ()=>{  
      await sle.offline.keyfile.lock(
        prik,
        '123'
      ).then( async (keyfile) => {
        return io.keyfile.make({
          name: name,
          net: net,
          file: keyfile
        })
      }).catch( err => { 
        alert(err); 
      })
      
      console.log('Generate from privatekey');
    }
    a()
    break;
  case 'load-keyfile':
      io.keyfile.load()
    break;
  case 'drop-keyfile':
      
    break;
  default:
    console.log('none tested');
}

