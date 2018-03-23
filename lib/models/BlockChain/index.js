'use strict'

const sha256 = require('sha256')
const fs = require('fs')
const getDifficulty = require('../../utils/hashDifficulty')

let blockChain = []
let difficulty
let filePath

module.exports = {
  read: path => {
    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', (err, data) => {
        try {
          blockChain = JSON.parse(data)
        } catch (e) {
          reject(e)
        }
        difficulty = Math.floor(blockChain.length / 10)
        filePath = path
        resolve(blockChain)
      })
    })
  },
  getDifficulty: () => getDifficulty(difficulty),
  getChain: () => blockChain,
  getLastBlock: () => blockChain[blockChain.length - 1],
  commit: block => {
    return new Promise((resolve, reject) => {
      blockChain.push(block)
      if (blockChain.length % 10 === 0) difficulty++
      fs.writeFile('blockChain.json', JSON.stringify(blockChain, null, 2), 'utf8', err => {
        if (err) return reject(err)
        return resolve(blockChain)
      })
    })
  }
}
