const Block = require(`${process.cwd()}/lib/models/Block`)

describe('#Block', () => {
  beforeEach(() => {})

  it('should not be able to create a normal block as the genesis one', () => {
    let block
    try {
      block = new Block({})
    } catch (e) {
      expect(e.message).to.eql('cant create block without genesis block')
    }
  })

  it('should be able to create a genesisBlock', () => {
    const genesisBlock = Block.createGenesisBlock('someId')

    expect(genesisBlock.id).to.eql(0)
    expect(genesisBlock.nonce).to.eql(0)
    expect(genesisBlock.transactions).to.eql([{ toId: 'someId', amount: 100 }])
    expect(genesisBlock.header.bits).to.eql('0')
  })

  it('should be able to create a block if you pass in a previous one', () => {
    const genesisBlock = Block.createGenesisBlock('someId')
    const block = new Block({
      transactions: [],
      nonce: 0,
      lastBlock: genesisBlock,
      timestamp: 1337
    })
    expect(block).to.eql({
      id: 1,
      transactions: [],
      nonce: 0,
      header: {
        hash: '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945',
        previous: 'd02d2a6f7d3776d246d22c2832f10e273f80396c0cd8697e05757d0c6f701564',
        bits: undefined,
        timestamp: 1337
      }
    })
  })

  it('should be able to validate its hash based on nonce', () => {
    const genesisBlock = Block.createGenesisBlock('someId')
    const block = new Block({
      transactions: [],
      nonce: 0,
      difficulty: '0',
      lastBlock: genesisBlock,
      timestamp: 1337
    })

    expect(block.checkHash()).to.eql(false)
    block.nonce++
    expect(block.checkHash()).to.eql(true)
  })
})
