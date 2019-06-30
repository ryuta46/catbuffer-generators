const assert = require('assert');
const JavaScriptUtils = require('../../support/JavaScriptUtils.js');
const { AccountMosaicRestrictionModificationBuffer } = require('../../../../_generated/js/AccountMosaicRestrictionModificationBuffer.js');


describe('AccountMosaicRestrictionModificationBuffer generated class', () => {
	it('has required getters and setters', () => {
		const buffer = new AccountMosaicRestrictionModificationBuffer();
		buffer.getModificationtype();
		buffer.setModificationtype(null);
		buffer.getValue();
		buffer.setValue(null);
	});

	it('loadFromBinary initializes from binary data', () => {
		const modificationTypeBuffer = Buffer.of(0xF2);
		const valueBuffer = Buffer.of(0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC);
		const consumableBuffer = new JavaScriptUtils.Uint8ArrayConsumableBuffer(new Uint8Array(Buffer.concat([
			modificationTypeBuffer,
			valueBuffer
		])));
		const buffer = AccountMosaicRestrictionModificationBuffer.loadFromBinary(consumableBuffer);

		assert.deepEqual(buffer.modificationType, modificationTypeBuffer);
		assert.deepEqual(buffer.value, valueBuffer);
		assert.equal(consumableBuffer.binary.length, consumableBuffer.offset);
	});

	it('serialize outputs a valid formatted buffer', () => {
		const modificationTypeBuffer = Buffer.of(0xF4);
		const valueBuffer = Buffer.of(0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC);

		const buffer = new AccountMosaicRestrictionModificationBuffer();
		buffer.modificationType = modificationTypeBuffer;
		buffer.value = valueBuffer;

		const serializedData = buffer.serialize();
		assert.deepEqual(serializedData, Buffer.concat([
			modificationTypeBuffer,
			valueBuffer
		]));
	});
});
