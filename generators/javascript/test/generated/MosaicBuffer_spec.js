const assert = require('assert');
const JavaScriptUtils = require('../../support/JavaScriptUtils.js');
const { MosaicBuffer } = require('../../../../_generated/js/MosaicBuffer.js');


describe('MosaicBuffer generated class', () => {
	it('has required getters and setters', () => {
		const buffer = new MosaicBuffer();
		buffer.getMosaicid();
		buffer.setMosaicid(null);
		buffer.getAmount();
		buffer.setAmount(null);
	});

	it('loadFromBinary initializes from binary data', () => {
		const mosaicIdBuffer = Buffer.of(0xF2, 0x26, 0x6C, 0x06, 0x40, 0x83, 0xB2, 0x92);
		const mosaicAmountBuffer = Buffer.of(0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44);
		const consumableBuffer = new JavaScriptUtils.Uint8ArrayConsumableBuffer(new Uint8Array(Buffer.concat([
			mosaicIdBuffer,
			mosaicAmountBuffer
		])));
		const mosaicBuffer = MosaicBuffer.loadFromBinary(consumableBuffer);

		assert.deepEqual(mosaicBuffer.mosaicId, mosaicIdBuffer);
		assert.deepEqual(mosaicBuffer.amount, mosaicAmountBuffer);
		assert.equal(consumableBuffer.binary.length, consumableBuffer.offset);
	});

	it('serialize outputs a valid formatted buffer', () => {
		const mosaicIdBuffer = Buffer.of(0xF2, 0x26, 0x6C, 0x06, 0x40, 0x83, 0xB2, 0x92);
		const mosaicAmountBuffer = Buffer.of(0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44, 0x44);

		const buffer = new MosaicBuffer();
		buffer.mosaicId = mosaicIdBuffer;
		buffer.amount = mosaicAmountBuffer;

		const serializedData = buffer.serialize();
		assert.deepEqual(serializedData, Buffer.concat([
			mosaicIdBuffer,
			mosaicAmountBuffer
		]));
	});
});
