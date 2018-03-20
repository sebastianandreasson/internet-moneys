'use strict'

const sha256 = require('sha256')
const hexToBinary = require('../utils/hexToBinary')
const getDifficulty = require('../utils/getDifficulty')
const Transaction = require('./Transaction')
const fs = require('fs')

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
    this.difficulty = 1
    this.hash = sha256(JSON.stringify(this.transactions))
  }
}

const blockChain = []
fs.readFile('blockChain.json', 'utf8', (err, data) => {
  if (!err) {
    const blocks = JSON.parse(data)

    blocks.forEach((b, i) => {
      if (i === 0) {
        const block = new GenesisBlock(b)
        blockChain.push(block)
      } else {
        const block = new Block(b)
        block.commit()
      }
    })
  }
})

class Block {
  constructor({ transactions, nonce }) {
    this.id = blockChain.length
    this.nonce = nonce

    const lastBlock = blockChain[blockChain.length - 1]
    this.header = lastBlock.hash
    this.difficulty =
      lastBlock.id % 10 === 0
        ? lastBlock.difficulty + 1
        : lastBlock.difficulty
    this.transactions = transactions

    this.hash = sha256(JSON.stringify(this.transactions))
  }

  validate() {
    const bits = hexToBinary(this.hash)

    const lastBlock = blockChain[blockChain.length - 1]
    const difficulty = getDifficulty(lastBlock ? lastBlock.difficulty : 1)

    if (bits.indexOf(difficulty) === 0) {
      return true
    }
    return false
  }

  commit() {
    if (this.validate()) {
      blockChain.push(this)
      fs.writeFile(
        'blockChain.json',
        JSON.stringify(blockChain, null, 2),
        'utf8'
      ),
        () => {}
    }
  }

  merkleRoot() {
    return this.hash
  }
}

Block.createGenesisBlock = toId => {
  const genesisBlock = new GenesisBlock({ toId })
  blockChain.push(genesisBlock)
}

Block.getChain = () => {
  return blockChain
}

module.exports = Block
