'use strict'

const sha256 = require('sha256')
const fs = require('fs')
const getDifficulty = require('../../utils/hashDifficulty')
const Block = require('../Block')
const Transaction = require('../Transaction')

let blockChain = []
let difficulty = 1
let filePath

const BlockChain = {}

BlockChain.read = path => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      let valid = true
      try {
        blockChain = JSON.parse(data)
        blockChain.forEach((b, i) => {
          if (i > 0) {
            const block = new Block({
              nonce: b.nonce,
              transactions: b.transactions,
              timestamp: b.header.timestamp,
              lastBlock: blockChain[i - 1],
              bits: b.header.bits
            })
            if (!block.checkHash()) valid = false

            if ((i + 1) % 10 === 0) difficulty++
          }
        })
      } catch (e) {
        blockChain = []
      }
      filePath = path
      if (valid) {
        return resolve(blockChain)
      }
      return reject(new Error('blockchain does not validate'))
    })
  })
}

BlockChain.getDifficulty = () => getDifficulty(difficulty)

BlockChain.getChain = () => blockChain

BlockChain.getLastBlock = () => blockChain[blockChain.length - 1]

BlockChain.validate = block => {
  const transActionsValid = block.transactions
    .map(t => new Transaction(t))
    .reduce((valid, transaction) => (valid ? transaction.validate() : valid), true)

  return transActionsValid && block.validate()
}

BlockChain.commit = block => {
  return new Promise((resolve, reject) => {
    if (BlockChain.validate(block)) {
      blockChain.push(block)
      if (blockChain.length % 10 === 0) difficulty++
      return fs.writeFile(filePath, JSON.stringify(blockChain, null, 2), 'utf8', err => {
        if (err) return reject(err)
        Transaction.clearMemPool()
        return resolve(blockChain)
      })
    }

    return reject(new Error('Block did not validate'))
  })
}

module.exports = BlockChain
