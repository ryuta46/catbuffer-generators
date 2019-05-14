var assert = require('assert')
const JavaScriptUtils = require('../../../../_generated/js/JavaScriptUtils.js')
const { AddressPropertyModificationBuffer } = require('../../../../_generated/js/AddressPropertyModificationBuffer.js')


describe('AddressPropertyModificationBuffer generated class', function () {
    it('has required getters and setters', function(done) {
        var buffer = new AddressPropertyModificationBuffer()
        buffer.getModificationtype()
        buffer.setModificationtype(null)
        buffer.getValue()
        buffer.setValue(null)
        done()
    })

    it('loadFromBinary initializes from binary data', function(done) {
        var modificationTypeBuffer = Buffer.of(0xF2)
        var valueBuffer = Buffer.of(
                0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
                0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18
        )
        var consumableBuffer = new JavaScriptUtils.Uint8ArrayConsumableBuffer(new Uint8Array(Buffer.concat([
            modificationTypeBuffer,
            valueBuffer,
        ])))
        var buffer = AddressPropertyModificationBuffer.loadFromBinary(consumableBuffer)

        assert.deepEqual(buffer.modificationType, modificationTypeBuffer)
        assert.deepEqual(buffer.value, valueBuffer)
        assert.equal(consumableBuffer.binary.length, consumableBuffer.offset)
        done()
    })

    it('serialize outputs a valid formatted buffer', function(done) {
        var modificationTypeBuffer = Buffer.of(0xF2)
        var valueBuffer = Buffer.of(
                0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
                0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18
        )

        var buffer = new AddressPropertyModificationBuffer()
        buffer.modificationType = modificationTypeBuffer
        buffer.value = valueBuffer

        var serializedData = buffer.serialize()
        assert.deepEqual(serializedData, Buffer.concat([
            modificationTypeBuffer,
            valueBuffer,
        ]))

        done()
    })
})
