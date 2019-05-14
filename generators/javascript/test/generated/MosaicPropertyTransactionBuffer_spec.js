var assert = require('assert')
const JavaScriptUtils = require('../../../../_generated/js/JavaScriptUtils.js')
const { MosaicPropertyModificationBuffer } = require('../../../../_generated/js/MosaicPropertyModificationBuffer.js')
const { MosaicPropertyTransactionBuffer } = require('../../../../_generated/js/MosaicPropertyTransactionBuffer.js')


describe('MosaicPropertyTransactionBuffer generated class', function () {
    it('has required getters and setters', function(done) {
        var buffer = new MosaicPropertyTransactionBuffer()
        buffer.getSize()
        buffer.setSize(null)
        buffer.getSignature()
        buffer.setSignature(null)
        buffer.getSigner()
        buffer.setSigner(null)
        buffer.getVersion()
        buffer.setVersion(null)
        buffer.getType()
        buffer.setType(null)
        buffer.getFee()
        buffer.setFee(null)
        buffer.getDeadline()
        buffer.setDeadline(null)
        buffer.getPropertytype()
        buffer.setPropertytype(null)
        buffer.getModifications()
        buffer.setModifications(null)
        done()
    })

    it('loadFromBinary initializes from binary data', function(done) {
        var modificationBuffer1 = new MosaicPropertyModificationBuffer()
        modificationBuffer1.modificationType = new Uint8Array(Buffer.of(0x04))
        modificationBuffer1.value = new Uint8Array(Buffer.of(0x34, 0x77, 0x34, 0x77, 0x34, 0x77, 0x34, 0x77))
        var modification1 = modificationBuffer1.serialize()
        var modificationBuffer2 = new MosaicPropertyModificationBuffer()
        modificationBuffer2.modificationType = new Uint8Array(Buffer.of(0x05))
        modificationBuffer2.value = new Uint8Array(Buffer.of(0x44, 0x33, 0x44, 0x33, 0x44, 0x33, 0x44, 0x33))
        var modification2 = modificationBuffer2.serialize()

        var sizeBuffer = Buffer.of(0xF2, 0x26, 0x6C, 0x06)
        var signatureBuffer = Buffer.of(
                0xF5, 0x24, 0x8C, 0xB0, 0x05, 0x49, 0xC6, 0x15, 0xFC, 0x56, 0x13, 0x08, 0xE3, 0x4B, 0x60, 0xFF,
                0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
                0xCC, 0x2E, 0x09, 0x59, 0x38, 0x97, 0xF2, 0x69, 0xD9, 0xE2, 0x56, 0x29, 0x2B, 0xF3, 0x52, 0xC0,
                0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48
        )
        var signerBuffer = Buffer.of(
                0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
                0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48
        )
        var versionBuffer = Buffer.of(0xFF, 0x36)
        var typeBuffer = Buffer.of(0x22, 0x66)
        var feeBuffer = Buffer.of(0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF2, 0x06)
        var deadlineBuffer = Buffer.of(0xF2, 0x26, 0x0C, 0x4C, 0xF7, 0xF1, 0x6C, 0x06)
        var propertyTypeBuffer = Buffer.of(0x26)
        var modificationsCountBuffer = Buffer.of(0x02)
        var modificationsBuffer = Buffer.concat([
            modification1,
            modification2,
        ])
        var consumableBuffer = new JavaScriptUtils.Uint8ArrayConsumableBuffer(new Uint8Array(Buffer.concat([
            sizeBuffer,
            signatureBuffer,
            signerBuffer,
            versionBuffer,
            typeBuffer,
            feeBuffer,
            deadlineBuffer,
            propertyTypeBuffer,
            modificationsCountBuffer,
            modificationsBuffer,
        ])))
        var buffer = MosaicPropertyTransactionBuffer.loadFromBinary(consumableBuffer)

        assert.deepEqual(buffer.size, sizeBuffer)
        assert.deepEqual(buffer.signature, signatureBuffer)
        assert.deepEqual(buffer.signer, signerBuffer)
        assert.deepEqual(buffer.version, versionBuffer)
        assert.deepEqual(buffer.type, typeBuffer)
        assert.deepEqual(buffer.fee, feeBuffer)
        assert.deepEqual(buffer.deadline, deadlineBuffer)
        assert.deepEqual(buffer.propertyType, propertyTypeBuffer)
        assert.deepEqual(buffer.modifications.length, 2)
        assert.deepEqual(buffer.modifications[0].serialize(), modification1)
        assert.deepEqual(buffer.modifications[1].serialize(), modification2)
        assert.equal(consumableBuffer.binary.length, consumableBuffer.offset)
        done()
    })

    it('serialize outputs a valid formatted buffer', function(done) {
        var modificationBuffer1 = new MosaicPropertyModificationBuffer()
        modificationBuffer1.modificationType = new Uint8Array(Buffer.of(0x04))
        modificationBuffer1.value = new Uint8Array(Buffer.of(0x34, 0x77, 0x34, 0x77, 0x34, 0x77, 0x34, 0x77))
        var modification1 = modificationBuffer1.serialize()
        var modificationBuffer2 = new MosaicPropertyModificationBuffer()
        modificationBuffer2.modificationType = new Uint8Array(Buffer.of(0x05))
        modificationBuffer2.value = new Uint8Array(Buffer.of(0x44, 0x33, 0x44, 0x33, 0x44, 0x33, 0x44, 0x33))
        var modification2 = modificationBuffer2.serialize()

        var sizeBuffer = Buffer.of(0xF2, 0x26, 0x6C, 0x06)
        var signatureBuffer = Buffer.of(
                0xF5, 0x24, 0x8C, 0xB0, 0x05, 0x49, 0xC6, 0x15, 0xFC, 0x56, 0x13, 0x08, 0xE3, 0x4B, 0x60, 0xFF,
                0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
                0xCC, 0x2E, 0x09, 0x59, 0x38, 0x97, 0xF2, 0x69, 0xD9, 0xE2, 0x56, 0x29, 0x2B, 0xF3, 0x52, 0xC0,
                0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48
        )
        var signerBuffer = Buffer.of(
                0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
                0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48
        )
        var versionBuffer = Buffer.of(0xFF, 0x36)
        var typeBuffer = Buffer.of(0x22, 0x66)
        var feeBuffer = Buffer.of(0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF2, 0x06)
        var deadlineBuffer = Buffer.of(0xF2, 0x26, 0x0C, 0x4C, 0xF7, 0xF1, 0x6C, 0x06)
        var propertyTypeBuffer = Buffer.of(0x26)
        var modificationsCountBuffer = Buffer.of(0x02)
        var modificationsBuffer = Buffer.concat([
            modification1,
            modification2,
        ])

        var buffer = new MosaicPropertyTransactionBuffer()
        buffer.size = sizeBuffer
        buffer.signature = signatureBuffer
        buffer.signer = signerBuffer
        buffer.version = versionBuffer
        buffer.type = typeBuffer
        buffer.fee = feeBuffer
        buffer.deadline = deadlineBuffer
        buffer.propertyType = propertyTypeBuffer
        buffer.modifications = [modificationBuffer1, modificationBuffer2]

        var serializedData = buffer.serialize()
        assert.deepEqual(serializedData, Buffer.concat([
            sizeBuffer,
            signatureBuffer,
            signerBuffer,
            versionBuffer,
            typeBuffer,
            feeBuffer,
            deadlineBuffer,
            propertyTypeBuffer,
            modificationsCountBuffer,
            modificationsBuffer,
        ]))

        done()
    })
})
