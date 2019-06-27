var assert = require('assert')
const JavaScriptUtils = require('../../support/JavaScriptUtils.js')
const { MosaicBuffer } = require('../../../../_generated/js/MosaicBuffer.js')


describe('MosaicBuffer generated class', function () {
    it('has required getters and setters', function(done) {
        var buffer = new MosaicBuffer()
        buffer.getMosaicid()
        buffer.setMosaicid(null)
        buffer.getAmount()
        buffer.setAmount(null)
        done()
    })

    it('loadFromBinary initializes from binary data', function(done) {
        var mosaicIdBuffer = Buffer.of(0xF2, 0x26, 0x6C, 0x06, 0x40, 0x83, 0xB2, 0x92)
        var mosaicAmountBuffer = Buffer.of(0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44)
        var consumableBuffer = new JavaScriptUtils.Uint8ArrayConsumableBuffer(new Uint8Array(Buffer.concat([
            mosaicIdBuffer,
            mosaicAmountBuffer,
        ])))
        var mosaicBuffer = MosaicBuffer.loadFromBinary(consumableBuffer)
        
        assert.deepEqual(mosaicBuffer.mosaicId, mosaicIdBuffer)
        assert.deepEqual(mosaicBuffer.amount, mosaicAmountBuffer)
        assert.equal(consumableBuffer.binary.length, consumableBuffer.offset)
        done()
    })

    it('serialize outputs a valid formatted buffer', function(done) {
        var mosaicIdBuffer = Buffer.of(0xF2, 0x26, 0x6C, 0x06, 0x40, 0x83, 0xB2, 0x92)
        var mosaicAmountBuffer = Buffer.of(0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44)
        
        var buffer = new MosaicBuffer()
        buffer.mosaicId = mosaicIdBuffer
        buffer.amount = mosaicAmountBuffer

        var serializedData = buffer.serialize()
        assert.deepEqual(serializedData, Buffer.concat([
            mosaicIdBuffer,
            mosaicAmountBuffer,
        ]))

        done()
    })
})
