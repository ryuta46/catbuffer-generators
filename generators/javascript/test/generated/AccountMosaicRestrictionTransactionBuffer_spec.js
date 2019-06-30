const assert = require('assert');
const JavaScriptUtils = require('../../support/JavaScriptUtils.js');
const { AccountMosaicRestrictionModificationBuffer } = require('../../../../_generated/js/AccountMosaicRestrictionModificationBuffer.js');
const { AccountMosaicRestrictionTransactionBuffer } = require('../../../../_generated/js/AccountMosaicRestrictionTransactionBuffer.js');


describe('AccountMosaicRestrictionTransactionBuffer generated class', () => {
	it('has required getters and setters', () => {
		const buffer = new AccountMosaicRestrictionTransactionBuffer();
		buffer.getSize();
		buffer.setSize(null);
		buffer.getSignature();
		buffer.setSignature(null);
		buffer.getSigner();
		buffer.setSigner(null);
		buffer.getVersion();
		buffer.setVersion(null);
		buffer.getType();
		buffer.setType(null);
		buffer.getFee();
		buffer.setFee(null);
		buffer.getDeadline();
		buffer.setDeadline(null);
		buffer.getRestrictiontype();
		buffer.setRestrictiontype(null);
		buffer.getModifications();
		buffer.setModifications(null);
	});

	it('loadFromBinary initializes from binary data', () => {
		const modificationBuffer1 = new AccountMosaicRestrictionModificationBuffer();
		modificationBuffer1.modificationType = new Uint8Array(Buffer.of(0x04));
		modificationBuffer1.value = new Uint8Array(Buffer.of(0x34, 0x77, 0x34, 0x77, 0x34, 0x77, 0x34, 0x77));
		const modification1 = modificationBuffer1.serialize();
		const modificationBuffer2 = new AccountMosaicRestrictionModificationBuffer();
		modificationBuffer2.modificationType = new Uint8Array(Buffer.of(0x05));
		modificationBuffer2.value = new Uint8Array(Buffer.of(0x44, 0x33, 0x44, 0x33, 0x44, 0x33, 0x44, 0x33));
		const modification2 = modificationBuffer2.serialize();

		const sizeBuffer = Buffer.of(0xF2, 0x26, 0x6C, 0x06);
		const signatureBuffer = Buffer.of(
			0xF5, 0x24, 0x8C, 0xB0, 0x05, 0x49, 0xC6, 0x15, 0xFC, 0x56, 0x13, 0x08, 0xE3, 0x4B, 0x60, 0xFF,
			0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
			0xCC, 0x2E, 0x09, 0x59, 0x38, 0x97, 0xF2, 0x69, 0xD9, 0xE2, 0x56, 0x29, 0x2B, 0xF3, 0x52, 0xC0,
			0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48
		);
		const signerBuffer = Buffer.of(
			0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
			0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48
		);
		const versionBuffer = Buffer.of(0xFF, 0x36);
		const typeBuffer = Buffer.of(0x22, 0x66);
		const feeBuffer = Buffer.of(0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF2, 0x06);
		const deadlineBuffer = Buffer.of(0xF2, 0x26, 0x0C, 0x4C, 0xF7, 0xF1, 0x6C, 0x06);
		const accountRestrictionTypeBuffer = Buffer.of(0x26);
		const modificationsCountBuffer = Buffer.of(0x02);
		const modificationsBuffer = Buffer.concat([
			modification1,
			modification2
		]);
		const consumableBuffer = new JavaScriptUtils.Uint8ArrayConsumableBuffer(new Uint8Array(Buffer.concat([
			sizeBuffer,
			signatureBuffer,
			signerBuffer,
			versionBuffer,
			typeBuffer,
			feeBuffer,
			deadlineBuffer,
			accountRestrictionTypeBuffer,
			modificationsCountBuffer,
			modificationsBuffer
		])));
		const buffer = AccountMosaicRestrictionTransactionBuffer.loadFromBinary(consumableBuffer);

		assert.deepEqual(buffer.size, sizeBuffer);
		assert.deepEqual(buffer.signature, signatureBuffer);
		assert.deepEqual(buffer.signer, signerBuffer);
		assert.deepEqual(buffer.version, versionBuffer);
		assert.deepEqual(buffer.type, typeBuffer);
		assert.deepEqual(buffer.fee, feeBuffer);
		assert.deepEqual(buffer.deadline, deadlineBuffer);
		assert.deepEqual(buffer.restrictionType, accountRestrictionTypeBuffer);
		assert.deepEqual(buffer.modifications.length, 2);
		assert.deepEqual(buffer.modifications[0].serialize(), modification1);
		assert.deepEqual(buffer.modifications[1].serialize(), modification2);
		assert.equal(consumableBuffer.binary.length, consumableBuffer.offset);
	});

	it('serialize outputs a valid formatted buffer', () => {
		const modificationBuffer1 = new AccountMosaicRestrictionModificationBuffer();
		modificationBuffer1.modificationType = new Uint8Array(Buffer.of(0x04));
		modificationBuffer1.value = new Uint8Array(Buffer.of(0x34, 0x77, 0x34, 0x77, 0x34, 0x77, 0x34, 0x77));
		const modification1 = modificationBuffer1.serialize();
		const modificationBuffer2 = new AccountMosaicRestrictionModificationBuffer();
		modificationBuffer2.modificationType = new Uint8Array(Buffer.of(0x05));
		modificationBuffer2.value = new Uint8Array(Buffer.of(0x44, 0x33, 0x44, 0x33, 0x44, 0x33, 0x44, 0x33));
		const modification2 = modificationBuffer2.serialize();

		const sizeBuffer = Buffer.of(0xF2, 0x26, 0x6C, 0x06);
		const signatureBuffer = Buffer.of(
			0xF5, 0x24, 0x8C, 0xB0, 0x05, 0x49, 0xC6, 0x15, 0xFC, 0x56, 0x13, 0x08, 0xE3, 0x4B, 0x60, 0xFF,
			0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
			0xCC, 0x2E, 0x09, 0x59, 0x38, 0x97, 0xF2, 0x69, 0xD9, 0xE2, 0x56, 0x29, 0x2B, 0xF3, 0x52, 0xC0,
			0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48
		);
		const signerBuffer = Buffer.of(
			0x3E, 0xE9, 0xFA, 0x15, 0xA3, 0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF1, 0xB1, 0x5A, 0xAB, 0xDC,
			0xE8, 0x34, 0x62, 0x6D, 0x00, 0x3C, 0xBF, 0xC2, 0x18, 0x0D, 0x71, 0xED, 0x25, 0x72, 0x3F, 0x48
		);
		const versionBuffer = Buffer.of(0xFF, 0x36);
		const typeBuffer = Buffer.of(0x22, 0x66);
		const feeBuffer = Buffer.of(0xB6, 0x05, 0xDC, 0x0C, 0x4C, 0xF7, 0xF2, 0x06);
		const deadlineBuffer = Buffer.of(0xF2, 0x26, 0x0C, 0x4C, 0xF7, 0xF1, 0x6C, 0x06);
		const accountRestrictionTypeBuffer = Buffer.of(0x26);
		const modificationsCountBuffer = Buffer.of(0x02);
		const modificationsBuffer = Buffer.concat([
			modification1,
			modification2
		]);

		const buffer = new AccountMosaicRestrictionTransactionBuffer();
		buffer.size = sizeBuffer;
		buffer.signature = signatureBuffer;
		buffer.signer = signerBuffer;
		buffer.version = versionBuffer;
		buffer.type = typeBuffer;
		buffer.fee = feeBuffer;
		buffer.deadline = deadlineBuffer;
		buffer.restrictionType = accountRestrictionTypeBuffer;
		buffer.modifications = [modificationBuffer1, modificationBuffer2];

		const serializedData = buffer.serialize();
		assert.deepEqual(serializedData, Buffer.concat([
			sizeBuffer,
			signatureBuffer,
			signerBuffer,
			versionBuffer,
			typeBuffer,
			feeBuffer,
			deadlineBuffer,
			accountRestrictionTypeBuffer,
			modificationsCountBuffer,
			modificationsBuffer
		]));
	});
});
