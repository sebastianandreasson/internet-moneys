'use strict'

module.exports = function(difficulty = 0) {
  let bits = '0'
  for (let i = 0; i < difficulty; i++) {
    bits += '0'
  }
  return bits
}
