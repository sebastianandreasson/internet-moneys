const sha256 = require('sha256')
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
  const isValid = block.validate()
  console.log(block.id, block.header.bits, isValid)
  if (isValid) {
    block.commit()
    return createBlock()
  }

  setTimeout(() => validateBlock(block, nonce + 1), 10)
}

setTimeout(() => {
  if (Block.getChain().length === 0) {
    Block.createGenesisBlock(myWalletId)
  }
  createBlock()
}, 1000)
