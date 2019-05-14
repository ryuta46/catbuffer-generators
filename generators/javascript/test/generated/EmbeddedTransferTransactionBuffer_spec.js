var assert = require('assert')
const JavaScriptUtils = require('../../../../_generated/js/JavaScriptUtils.js')
const { MosaicBuffer } = require('../../../../_generated/js/MosaicBuffer.js')
const { EmbeddedTransferTransactionBuffer } = require('../../../../_generated/js/EmbeddedTransferTransactionBuffer.js')


describe('EmbeddedTransferTransactionBuffer generated class', function () {
    it('has required getters and setters', function(done) {
        var buffer = new EmbeddedTransferTransactionBuffer()
        buffer.getSize()
        buffer.setSize(null)
        buffer.getSigner()
        buffer.setSigner(null)
        buffer.getVersion()
        buffer.setVersion(null)
        buffer.getType()
        buffer.setType(null)
        buffer.getRecipient()
        buffer.setRecipient(null)
        buffer.getMessage()
        buffer.setMessage(null)
        buffer.getMosaics()
        buffer.setMosaics(null)
        done()
    })

    it('loadFromBinary initializes from binary data', function(done) {
        var mosaicBuffer1 = new MosaicBuffer()
        mosaicBuffer1.mosaicId = new Uint8Array(Buffer.of(0xF2, 0x26, 0x6C, 0x06, 0x40, 0x83, 0xB2, 0x92))
        mosaicBuffer1.amount = new Uint8Array(Buffer.of(0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44))
        var mosaicBuffer2 = new MosaicBuffer()
        var mosaic1 = mosaicBuffer1.serialize()
        mosaicBuffer2.mosaicId = new Uint8Array(Buffer.of(0xF2, 0x26, 0x6C, 0x06, 0x40, 0x83, 0xB2, 0x92))
        mosaicBuffer2.amount = new Uint8Array(Buffer.of(0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44))
        var mosaic2 = mosaicBuffer2.serialize()
        
        var sizeBuffer = Buffer.of(0xF2, 0x26, 0x6C, 0x06)
        var signerBuffer = Buffer.of(
                0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
                0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48
        )
        var versionBuffer = Buffer.of(0xFF, 0x36)
        var typeBuffer = Buffer.of(0x22, 0x66)
        var recipientBuffer = Buffer.of(
            0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
            0xCC, 0x2E, 0x09, 0x59, 0x38, 0x97, 0xF2, 0x69, 0xD9
        )
        var messageSizeBuffer = Buffer.of(0x12, 0x00)
        var mosaicsCountBuffer = Buffer.of(0x02)
        var messageBuffer = Buffer.of(
            0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC,
            0x05, 0xDC
        )
        var mosaicsBuffer = Buffer.concat([
            mosaic1,
            mosaic2,
        ])
        var consumableBuffer = new JavaScriptUtils.Uint8ArrayConsumableBuffer(new Uint8Array(Buffer.concat([
            sizeBuffer,
            signerBuffer,
            versionBuffer,
            typeBuffer,
            recipientBuffer,
            messageSizeBuffer,
            mosaicsCountBuffer,
            messageBuffer,
            mosaicsBuffer,
        ])))
        var buffer = EmbeddedTransferTransactionBuffer.loadFromBinary(consumableBuffer)
        
        assert.deepEqual(buffer.size, sizeBuffer)
        assert.deepEqual(buffer.signer, signerBuffer)
        assert.deepEqual(buffer.version, versionBuffer)
        assert.deepEqual(buffer.type, typeBuffer)
        assert.deepEqual(buffer.recipient, recipientBuffer)
        assert.deepEqual(buffer.message, messageBuffer)
        assert.deepEqual(buffer.mosaics.length, 2)
        assert.deepEqual(buffer.mosaics[0].serialize(), mosaic1)
        assert.deepEqual(buffer.mosaics[1].serialize(), mosaic2)
        assert.equal(consumableBuffer.binary.length, consumableBuffer.offset)
        done()
    })

    it('serialize outputs a valid formatted buffer', function(done) {
        var mosaicBuffer1 = new MosaicBuffer()
        mosaicBuffer1.mosaicId = new Uint8Array(Buffer.of(0xF2, 0x26, 0x6C, 0x06, 0x40, 0x83, 0xB2, 0x92))
        mosaicBuffer1.amount = new Uint8Array(Buffer.of(0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44))
        var mosaicBuffer2 = new MosaicBuffer()
        var mosaic1 = mosaicBuffer1.serialize()
        mosaicBuffer2.mosaicId = new Uint8Array(Buffer.of(0xF2, 0x26, 0x6C, 0x06, 0x40, 0x83, 0xB2, 0x92))
        mosaicBuffer2.amount = new Uint8Array(Buffer.of(0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44))
        var mosaic2 = mosaicBuffer2.serialize()
        
        var sizeBuffer = Buffer.of(0xF2, 0x26, 0x6C, 0x06)
        var signerBuffer = Buffer.of(
                0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
                0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48
        )
        var versionBuffer = Buffer.of(0xFF, 0x36)
        var typeBuffer = Buffer.of(0x22, 0x66)
        var recipientBuffer = Buffer.of(
            0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
            0xCC, 0x2E, 0x09, 0x59, 0x38, 0x97, 0xF2, 0x69, 0xD9
        )
        var messageSizeBuffer = Buffer.of(0x12, 0x00)
        var mosaicsCountBuffer = Buffer.of(0x02)
        var messageBuffer = Buffer.of(
            0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC,
            0x05, 0xDC
        )
        var mosaicsBuffer = Buffer.concat([
            mosaic1,
            mosaic2,
        ])

        var buffer = new EmbeddedTransferTransactionBuffer()
        buffer.size = sizeBuffer
        buffer.signer = signerBuffer
        buffer.version = versionBuffer
        buffer.type = typeBuffer
        buffer.recipient = recipientBuffer
        buffer.message = messageBuffer
        buffer.mosaics = [mosaicBuffer1, mosaicBuffer2]

        var serializedData = buffer.serialize()
        assert.deepEqual(serializedData, Buffer.concat([
            sizeBuffer,
            signerBuffer,
            versionBuffer,
            typeBuffer,
            recipientBuffer,
            messageSizeBuffer,
            mosaicsCountBuffer,
            messageBuffer,
            mosaicsBuffer,
        ]))

        done()
    })
})
