const sha256 = require('sha256')
const BlockChain = require('./models/BlockChain')
const Block = require('./models/Block')
const startMining = require('./mine')

const myWalletId = sha256('0')

BlockChain.read('blockChain.json').then(blockChain => {
  console.log(blockChain)
  if (blockChain.length === 0) {
    const genesisBlock = Block.createGenesisBlock('someId')
    return BlockChain.commit(genesisBlock).then(() => startMining())
  }
  startMining()
})
