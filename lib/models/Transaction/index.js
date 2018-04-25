'use strict'

const sha256 = require('sha256')

let memPool = []

class Transaction {
  constructor({ fromId, toId, amount, isNew = true }) {
    if (fromId) this.fromId = fromId
    this.toId = toId
    this.amount = amount

    this.id = sha256(JSON.stringify(this))
    if (isNew && fromId && toId) {
      memPool.push(this)
    }
  }

  validate() {
    return true
  }
}

Transaction.getMemPool = () => memPool

Transaction.clearMemPool = () => {
  memPool = []
}

module.exports = Transaction
