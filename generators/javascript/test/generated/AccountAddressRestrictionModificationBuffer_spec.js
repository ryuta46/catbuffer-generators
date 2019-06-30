const assert = require('assert');
const JavaScriptUtils = require('../../support/JavaScriptUtils.js');
const { AccountAddressRestrictionModificationBuffer } = require('../../../../_generated/js/AccountAddressRestrictionModificationBuffer.js');


describe('AccountAddressRestrictionModificationBuffer generated class', () => {
	it('has required getters and setters', () => {
		const buffer = new AccountAddressRestrictionModificationBuffer();
		buffer.getModificationtype();
		buffer.setModificationtype(null);
		buffer.getValue();
		buffer.setValue(null);
	});

	it('loadFromBinary initializes from binary data', () => {
		const modificationTypeBuffer = Buffer.of(0xF2);
		const valueBuffer = Buffer.of(
			0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
			0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18
		);
		const consumableBuffer = new JavaScriptUtils.Uint8ArrayConsumableBuffer(new Uint8Array(Buffer.concat([
			modificationTypeBuffer,
			valueBuffer
		])));
		const buffer = AccountAddressRestrictionModificationBuffer.loadFromBinary(consumableBuffer);

		assert.deepEqual(buffer.modificationType, modificationTypeBuffer);
		assert.deepEqual(buffer.value, valueBuffer);
		assert.equal(consumableBuffer.binary.length, consumableBuffer.offset);
	});

	it('serialize outputs a valid formatted buffer', () => {
		const modificationTypeBuffer = Buffer.of(0xF2);
		const valueBuffer = Buffer.of(
			0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
			0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18
		);

		const buffer = new AccountAddressRestrictionModificationBuffer();
		buffer.modificationType = modificationTypeBuffer;
		buffer.value = valueBuffer;

		const serializedData = buffer.serialize();
		assert.deepEqual(serializedData, Buffer.concat([
			modificationTypeBuffer,
			valueBuffer
		]));
	});
});
