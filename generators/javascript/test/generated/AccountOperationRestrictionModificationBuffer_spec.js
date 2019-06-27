var assert = require('assert')
const JavaScriptUtils = require('../../support/JavaScriptUtils.js')
const { AccountOperationRestrictionModificationBuffer } = require('../../../../_generated/js/AccountOperationRestrictionModificationBuffer.js')


describe('AccountOperationRestrictionModificationBuffer generated class', function () {
    it('has required getters and setters', function(done) {
        var buffer = new AccountOperationRestrictionModificationBuffer()
        buffer.getModificationtype()
        buffer.setModificationtype(null)
        buffer.getValue()
        buffer.setValue(null)
        done()
    })

    it('loadFromBinary initializes from binary data', function(done) {
        var modificationTypeBuffer = Buffer.of(0xF2)
        var valueBuffer = Buffer.of(0x3E, 0xE9)
        var consumableBuffer = new JavaScriptUtils.Uint8ArrayConsumableBuffer(new Uint8Array(Buffer.concat([
            modificationTypeBuffer,
            valueBuffer,
        ])))
        var buffer = AccountOperationRestrictionModificationBuffer.loadFromBinary(consumableBuffer)

        assert.deepEqual(buffer.modificationType, modificationTypeBuffer)
        assert.deepEqual(buffer.value, valueBuffer)
        assert.equal(consumableBuffer.binary.length, consumableBuffer.offset)
        done()
    })

    it('serialize outputs a valid formatted buffer', function(done) {
        var modificationTypeBuffer = Buffer.of(0xF5)
        var valueBuffer = Buffer.of(0xFA, 0x15)

        var buffer = new AccountOperationRestrictionModificationBuffer()
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
