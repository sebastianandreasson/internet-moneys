'use strict'

// as a start just make it 1 to 1 of number of zeros needed to match the hash.
module.exports = (length = 1) =>
  Array.from({ length })
    .map(_ => '0')
    .join('')
