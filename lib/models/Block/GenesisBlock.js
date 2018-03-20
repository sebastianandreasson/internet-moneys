const sha256 = require('sha256')

class GenesisBlock {
  constructor({ toId }) {
    this.id = 0
    this.nonce = 0
    this.transactions = [
      {
        toId,
        amount: 100
      }
    ]

    this.header = {
      hash: sha256(JSON.stringify(this.transactions)),
      bits: '0',
      timestamp: Date.now()
    }
  }
}

module.exports = GenesisBlock
