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
    transactions
  })
  validateBlock(block, 0)
}

const validateBlock = (block, nonce) => {
  block.nonce = nonce
  const isValid = block.checkHash()
  console.log(block.id, block.header.bits, isValid)
  if (isValid) {
    block.commit()
    return createBlock()
  }

  setTimeout(() => validateBlock(block, nonce + 1), 10)
}

BlockChain.read('blockChain.json').then(blockChain => {
  if (blockChain.length === 0) {
    Block.createGenesisBlock(myWalletId)
  }
  createBlock()
})
