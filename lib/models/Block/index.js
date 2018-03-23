'use strict'

const sha256 = require('sha256')
const fs = require('fs')
const hexToBinary = require('../../utils/hexToBinary')

const GenesisBlock = require('./GenesisBlock')
const BlockChain = require('../BlockChain')
const Transaction = require('../Transaction')

class Block {
  constructor({ transactions, nonce, timestamp }) {
    this.id = BlockChain.getChain().length
    this.transactions = transactions
    this.nonce = nonce

    const lastBlock = BlockChain.getLastBlock()
    if (!lastBlock) {
      throw new Error('cant create block without genesis block')
    }
    this.header = {
      hash: sha256(JSON.stringify(this.transactions)),
      previous: lastBlock.header.hash,
      bits: BlockChain.getDifficulty(),
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

  commit() {
    if (this.validate()) {
      BlockChain.commit(this)
    }
  }
}

Block.createGenesisBlock = toId => {
  const genesisBlock = new GenesisBlock({ toId })
  BlockChain.commit(genesisBlock)
}

module.exports = Block
