'use strict'

const sha256 = require('sha256')
const fs = require('fs')
const hexToBinary = require('../../utils/hexToBinary')
const getDifficulty = require('../../utils/hashDifficulty')

const GenesisBlock = require('./GenesisBlock')
const Transaction = require('../Transaction')

let blockChain = []
let difficulty = 0
fs.readFile('blockChain.json', 'utf8', (err, data) => {
  try {
    blockChain = JSON.parse(data)
  } catch (e) {}
  difficulty = Math.floor(blockChain.length / 10)
})

class Block {
  constructor({ transactions, nonce, timestamp }) {
    this.id = blockChain.length
    this.transactions = transactions
    this.nonce = nonce

    const lastBlock = blockChain[blockChain.length - 1]
    this.header = {
      hash: sha256(JSON.stringify(this.transactions)),
      previous: lastBlock.header.hash,
      bits: getDifficulty(difficulty),
      timestamp: timestamp ? timestamp : Date.now()
    }
  }

  validate() {
    const hash = sha256(JSON.stringify(this))
    const bits = hexToBinary(hash)

    if (bits.indexOf(this.header.bits) === 0) {
      return true
    }
    return false
  }

  commit() {
    if (this.validate()) {
      blockChain.push(this)
      if (blockChain.length % 10 === 0) difficulty++
      fs.writeFile(
        'blockChain.json',
        JSON.stringify(blockChain, null, 2),
        'utf8'
      ),
        () => {}
    }
  }
}

Block.createGenesisBlock = toId => {
  const genesisBlock = new GenesisBlock({ toId })
  blockChain.push(genesisBlock)
}

Block.getChain = () => blockChain

module.exports = Block
