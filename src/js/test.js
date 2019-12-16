let test = [
  // 'Nodes-save',
  // 'Nodes-load',
  // 'Nodes-drop'
  // 'Nodes-save-DuplicateErr'
  // 'eNodes-duplicate-'
  // 'createAccount'
  // 'sq-nodes-save'
  // 'sq-nodes-load'
  // 'sq-nodes-drop'
  'sq-subchain-save'
]

let sqnodelist = [
  `("Seele", "none", "117.50.97.136:18037", "1")`,
  `("Seele", "none", "117.50.97.136:8038", "2")`,
  `("Seele", "none", "104.218.164.77:8039", "3")`,
  `("Seele", "none", "117.50.97.136:8036", "4")`
]
let sqsubchainlist = [
  `("Seele", "0x00d39049d839e1700a30a30c8fec717cbe0b0012")`
]

let nodelist = [
  ["Seele", "1", "117.50.97.136:18037", null],
  ["Seele", "2", "117.50.97.136:8038", null],
  ["Seele", "3", "104.218.164.77:8039", null],
  ["Seele", "4", "117.50.97.136:8036", null],
  ["Seele", "0", "117.50.97.136:8037", null],
  ["Seele", "0", "107.150.102.94:8038", null],
  ["Seele", "0", "104.218.164.77:8039", null],
  ["Seele", "0", "106.75.85.9:8037", null],
  ["Seele", "0", "117.50.11.129:8036", null],
  ["Seele", "0", "117.50.38.63:8036", null],
  ["Seele", "0", "107.150.96.231:8037", null],
  ["Seele", "0", "107.150.103.125:8039", null],
  ["Seele", "0", "104.218.164.169:8037", null],
  ["Seele", "0", "104.218.164.124:8039", null],
  ["Seele", "0", "104.218.164.193:8036", null],
  ["Seele", "0", "104.218.164.27:8037", null],
  ["Seele", "0", "106.75.90.237:18037", null],
  ["Seele", "0", "107.150.105.10:8037", null],
  ["SoloChain", "1", "107.150.105.10:8037", "Seele"],
  ["SoloChain", "0", "104.218.164.193:8036", "Seele"],
  ["SoloChain", "0", "104.218.164.27:8037", "Seele"],
  ["SoloChain", "0", "106.75.90.237:18037", "Seele"],
  ["SoloChain", "0", "107.150.105.10:8037", "Seele"],
  ["HipHopChain", "1", "107.150.105.10:8037", "Seele"],
  ["HipHopChain", "0", "104.218.164.193:8036", "Seele"],
  ["HipHopChain", "0", "104.218.164.27:8037", "Seele"],
  ["HipHopChain", "0", "106.75.90.237:18037", "Seele"],
  ["HipHopChain", "0", "107.150.105.10:8037", "Seele"]
]
let accountlist = [

]
let subchainlist = []
let transactions = []
let duplicateNodeEntry = [["Seele", "0", "106.75.85.9:8037", null]]
let deleteNode = [["Seele", "0", "106.75.85.9:8037", null]]

if ( test.includes('createAccount')) {
  // console.log(sle.offline)
  var mainKey = sle.offline.key.spawn(2)
  var subKey = sle.offline.sub.key.spawn()
  console.log(mainKey);
  console.log(subKey);


}

if ( test.includes('Nodes-save-DuplicateErr') ) {
  io.nodes.save(duplicateNodeEntry).then( d=>{
    console.log(d);
    io.nodes.load().then( rows => {
      console.log(rows);
    }).catch( e=>{
      console.log(e);
    })
  }).catch( e=>{
    console.log(e);
    if ( e.toString().includes('UNIQUE constraint failed')) {
      alert('duplicate')
    }
  })
}

if ( test.includes('Nodes-save') ) {
  io.nodes.save(nodelist).then( d=>{
    console.log(d);
    io.nodes.load().then( rows => {
      console.log(rows);
    }).catch( e=>{
      console.log(e);
    })
  }).catch( e=>{
    console.log(e);
  })
}

if ( test.includes('Nodes-load') ) {
  io.nodes.load().then( rows => {
    console.log(rows);
  }).catch( e=>{
    console.log(e);
  })
}

if ( test.includes('Nodes-drop') ) {
  io.nodes.drop(deleteNode).then(d=>{
    console.log(d);
  }).catch(e=>{console.log(e);})
}

if ( test.includes('sq-nodes-save') ) {
  sq.node.save(sqnodelist).then( a=>{
    console.log(a);
  }).catch( e=>{
    console.log(e);
  })
}

if ( test.includes('sq-nodes-load') ) {
  sq.node.load('TRUE').then( a=>{
    console.log(a);
  }).catch( e=>{
    console.log(e);
  })
}

if ( test.includes('sq-nodes-drop') ) {
  sq.node.drop('TRUE').then( a=>{
    console.log(a);
  }).catch( e=>{
    console.log(e);
  })
}

if ( test.includes('sq-subchain-save') ) {
  sq.subchain.save(sqsubchainlist).then( a=>{
    console.log(a);
  }).catch( e=>{
    console.log(e);
  })
}

if ( test.includes('sq-subchain-load') ) {
  sq.subchain.load('TRUE').then( a=>{
    console.log(a);
  }).catch( e=>{
    console.log(e);
  })
}

if ( test.includes('sq-subchain-drop') ) {
  sq.subchain.drop('TRUE').then( a=>{
    console.log(a);
  }).catch( e=>{
    console.log(e);
  })
}
