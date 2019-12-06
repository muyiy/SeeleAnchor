const ora = require('ora');
const cliSpinners = require('cli-spinners');
let spin = ora()

// console.log(compile(1));
console.log('start');
spin.start()
compile(1).then(a=>{
  spin.succeed()
  console.log(a);
  console.log('end');
})

function async(f) { 
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve(f)
    }, 0);
  });
}



function compile(x){
  setTimeout(function() {
    var i = 0
    while (i <= x*1000000000) { 
      i++;
    }
    return Promise.resolve(x)
  }, 0);
}