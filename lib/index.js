const sha256 = require('sha256')
const BlockChain = require('./models/BlockChain')
const Block = require('./models/Block')
const Transaction = require('./models/Transaction')

const myWalletId = sha256('0')

const createBlock = () => {
  const transactions = [
    new Transaction({
      toId: myWalletId,
      amount: 100
    })
  ].concat(Transaction.getMemPool())

  const block = new Block({
    nonce: 0,
    transactions,
    lastBlock: BlockChain.getLastBlock(),
    difficulty: BlockChain.getDifficulty()
  })
  console.log(block)
  mine(block, 0)
}

const mine = (block, nonce) => {
  block.nonce = nonce
  const validHash = block.checkHash()

  console.log(block.id, block.header.bits, validHash)

  if (block.validate()) {
    return BlockChain.commit(block).then(() => createBlock())
  }

  setTimeout(() => mine(block, nonce + 1), 10)
}

BlockChain.read('blockChain.json').then(blockChain => {
  // if (blockChain.length === 0) {
  //   const genesisBlock = Block.createGenesisBlock(myWalletId)
  //   return BlockChain.commit(genesisBlock).then(() => {
  //     createBlock()
  //   })
  // }
  // createBlock()
})
