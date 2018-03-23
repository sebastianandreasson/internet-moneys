'use strict'

const sha256 = require('sha256')
const fs = require('fs')
const hexToBinary = require('../../utils/hexToBinary')

const GenesisBlock = require('./GenesisBlock')
const Transaction = require('../Transaction')

class Block {
  constructor({ transactions, nonce, timestamp, lastBlock, difficulty, bits }) {
    if (!lastBlock) {
      throw new Error('cant create block without genesis block')
    }

    this.id = lastBlock.id + 1
    this.transactions = transactions
    this.nonce = nonce

    this.header = {
      hash: sha256(JSON.stringify(this.transactions)),
      previous: lastBlock.header.hash,
      bits: bits ? bits : difficulty,
      timestamp: timestamp ? timestamp : Date.now()
    }
  }

  checkHash() {
    const hash = sha256(JSON.stringify(this))
    const bits = hexToBinary(hash)

    return bits.indexOf(this.header.bits) === 0
  }

  validate() {
    const transActionsValid = this.transactions
      .map(t => new Transaction(t))
      .reduce((valid, transaction) => {
        if (valid) return transaction.validate()
        return valid
      }, true)

    return transActionsValid && this.checkHash()
  }
}

Block.createGenesisBlock = toId => new GenesisBlock({ toId })

module.exports = Block
