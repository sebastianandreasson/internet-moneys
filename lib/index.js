const Block = require('./models/Block')
const Transaction = require('./models/Transaction')
const sha256 = require('sha256')

const myWalletId = sha256('0')
// Block.createGenesisBlock(myWalletId)

const mine = nonce => {
  const transactions = Transaction.getMemPool()
  const block = new Block({
    nonce,
    transactions: [
      new Transaction({
        toId: myWalletId,
        amount: 100
      })
    ].concat(transactions)
  })

  const isValid = block.validate()
  console.log(block.id, block.hash, isValid, block.difficulty)
  if (isValid) {
    nonce = 0
    block.commit()
  }
  setTimeout(() => {
    mine(nonce + 1)
  }, 10)
}

setTimeout(() => {
  mine(0)
}, 1000)
