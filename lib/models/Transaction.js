'use strict'

const sha256 = require('sha256')

const memPool = []

class Transaction {
  constructor({ fromId, toId, amount }) {
    if (fromId) this.fromId = fromId
    this.toId = toId
    this.amount = amount

    this.id = sha256(JSON.stringify(this))
  }

  validate() {
    return true
  }
}

Transaction.getMemPool = () => memPool

module.exports = Transaction
