const assert = require('assert');
const JavaScriptUtils = require('../../support/JavaScriptUtils.js');
const { EmbeddedTransferTransactionBuffer } = require('../../../../_generated/js/EmbeddedTransferTransactionBuffer.js');
const { MosaicBuffer } = require('../../../../_generated/js/MosaicBuffer.js');


describe('EmbeddedTransferTransactionBuffer generated class', () => {
	it('has required getters and setters', () => {
		const buffer = new EmbeddedTransferTransactionBuffer();
		buffer.getSize();
		buffer.setSize(null);
		buffer.getSigner();
		buffer.setSigner(null);
		buffer.getVersion();
		buffer.setVersion(null);
		buffer.getType();
		buffer.setType(null);
		buffer.getRecipient();
		buffer.setRecipient(null);
		buffer.getMessage();
		buffer.setMessage(null);
		buffer.getMosaics();
		buffer.setMosaics(null);
	});

	it('loadFromBinary initializes from binary data', () => {
		const mosaicBuffer1 = new MosaicBuffer();
		mosaicBuffer1.mosaicId = new Uint8Array(Buffer.of(0xF2, 0x26, 0x6C, 0x06, 0x40, 0x83, 0xB2, 0x92));
		mosaicBuffer1.amount = new Uint8Array(Buffer.of(0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44));
		const mosaicBuffer2 = new MosaicBuffer();
		const mosaic1 = mosaicBuffer1.serialize();
		mosaicBuffer2.mosaicId = new Uint8Array(Buffer.of(0xF2, 0x26, 0x6C, 0x06, 0x40, 0x83, 0xB2, 0x92));
		mosaicBuffer2.amount = new Uint8Array(Buffer.of(0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44));
		const mosaic2 = mosaicBuffer2.serialize();

		const sizeBuffer = Buffer.of(0xF2, 0x26, 0x6C, 0x06);
		const signerBuffer = Buffer.of(
			0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
			0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48
		);
		const versionBuffer = Buffer.of(0xFF, 0x36);
		const typeBuffer = Buffer.of(0x22, 0x66);
		const recipientBuffer = Buffer.of(
			0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
			0xCC, 0x2E, 0x09, 0x59, 0x38, 0x97, 0xF2, 0x69, 0xD9
		);
		const messageSizeBuffer = Buffer.of(0x12, 0x00);
		const mosaicsCountBuffer = Buffer.of(0x02);
		const messageBuffer = Buffer.of(
			0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC,
			0x05, 0xDC
		);
		const mosaicsBuffer = Buffer.concat([
			mosaic1,
			mosaic2
		]);
		const consumableBuffer = new JavaScriptUtils.Uint8ArrayConsumableBuffer(new Uint8Array(Buffer.concat([
			sizeBuffer,
			signerBuffer,
			versionBuffer,
			typeBuffer,
			recipientBuffer,
			messageSizeBuffer,
			mosaicsCountBuffer,
			messageBuffer,
			mosaicsBuffer
		])));
		const buffer = EmbeddedTransferTransactionBuffer.loadFromBinary(consumableBuffer);

		assert.deepEqual(buffer.size, sizeBuffer);
		assert.deepEqual(buffer.signer, signerBuffer);
		assert.deepEqual(buffer.version, versionBuffer);
		assert.deepEqual(buffer.type, typeBuffer);
		assert.deepEqual(buffer.recipient, recipientBuffer);
		assert.deepEqual(buffer.message, messageBuffer);
		assert.deepEqual(buffer.mosaics.length, 2);
		assert.deepEqual(buffer.mosaics[0].serialize(), mosaic1);
		assert.deepEqual(buffer.mosaics[1].serialize(), mosaic2);
		assert.equal(consumableBuffer.binary.length, consumableBuffer.offset);
	});

	it('serialize outputs a valid formatted buffer', () => {
		const mosaicBuffer1 = new MosaicBuffer();
		mosaicBuffer1.mosaicId = new Uint8Array(Buffer.of(0xF2, 0x26, 0x6C, 0x06, 0x40, 0x83, 0xB2, 0x92));
		mosaicBuffer1.amount = new Uint8Array(Buffer.of(0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44));
		const mosaicBuffer2 = new MosaicBuffer();
		const mosaic1 = mosaicBuffer1.serialize();
		mosaicBuffer2.mosaicId = new Uint8Array(Buffer.of(0xF2, 0x26, 0x6C, 0x06, 0x40, 0x83, 0xB2, 0x92));
		mosaicBuffer2.amount = new Uint8Array(Buffer.of(0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44));
		const mosaic2 = mosaicBuffer2.serialize();

		const sizeBuffer = Buffer.of(0xF2, 0x26, 0x6C, 0x06);
		const signerBuffer = Buffer.of(
			0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
			0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48
		);
		const versionBuffer = Buffer.of(0xFF, 0x36);
		const typeBuffer = Buffer.of(0x22, 0x66);
		const recipientBuffer = Buffer.of(
			0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
			0xCC, 0x2E, 0x09, 0x59, 0x38, 0x97, 0xF2, 0x69, 0xD9
		);
		const messageSizeBuffer = Buffer.of(0x12, 0x00);
		const mosaicsCountBuffer = Buffer.of(0x02);
		const messageBuffer = Buffer.of(
			0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC, 0x05, 0xDC,
			0x05, 0xDC
		);
		const mosaicsBuffer = Buffer.concat([
			mosaic1,
			mosaic2
		]);

		const buffer = new EmbeddedTransferTransactionBuffer();
		buffer.size = sizeBuffer;
		buffer.signer = signerBuffer;
		buffer.version = versionBuffer;
		buffer.type = typeBuffer;
		buffer.recipient = recipientBuffer;
		buffer.message = messageBuffer;
		buffer.mosaics = [mosaicBuffer1, mosaicBuffer2];

		const serializedData = buffer.serialize();
		assert.deepEqual(serializedData, Buffer.concat([
			sizeBuffer,
			signerBuffer,
			versionBuffer,
			typeBuffer,
			recipientBuffer,
			messageSizeBuffer,
			mosaicsCountBuffer,
			messageBuffer,
			mosaicsBuffer
		]));
	});
});
