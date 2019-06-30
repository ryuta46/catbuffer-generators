const assert = require('assert');
const JavaScriptUtils = require('../../support/JavaScriptUtils.js');
const { AccountOperationRestrictionModificationBuffer } =
	require('../../../../_generated/js/AccountOperationRestrictionModificationBuffer.js');


describe('AccountOperationRestrictionModificationBuffer generated class', () => {
	it('has required getters and setters', () => {
		const buffer = new AccountOperationRestrictionModificationBuffer();
		buffer.getModificationtype();
		buffer.setModificationtype(null);
		buffer.getValue();
		buffer.setValue(null);
	});

	it('loadFromBinary initializes from binary data', () => {
		const modificationTypeBuffer = Buffer.of(0xF2);
		const valueBuffer = Buffer.of(0x3E, 0xE9);
		const consumableBuffer = new JavaScriptUtils.Uint8ArrayConsumableBuffer(new Uint8Array(Buffer.concat([
			modificationTypeBuffer,
			valueBuffer
		])));
		const buffer = AccountOperationRestrictionModificationBuffer.loadFromBinary(consumableBuffer);

		assert.deepEqual(buffer.modificationType, modificationTypeBuffer);
		assert.deepEqual(buffer.value, valueBuffer);
		assert.equal(consumableBuffer.binary.length, consumableBuffer.offset);
	});

	it('serialize outputs a valid formatted buffer', () => {
		const modificationTypeBuffer = Buffer.of(0xF5);
		const valueBuffer = Buffer.of(0xFA, 0x15);

		const buffer = new AccountOperationRestrictionModificationBuffer();
		buffer.modificationType = modificationTypeBuffer;
		buffer.value = valueBuffer;

		const serializedData = buffer.serialize();
		assert.deepEqual(serializedData, Buffer.concat([
			modificationTypeBuffer,
			valueBuffer
		]));
	});
});
