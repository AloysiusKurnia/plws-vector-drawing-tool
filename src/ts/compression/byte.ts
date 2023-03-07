export const buildBitPacker = () => {
    const byteOutput: number[] = [];
    let bitsInBuffer = 3;
    let numberBuffer = 0;
    const push = (number: number, bitLength: number) => {
        const leftoverBitsInBuffer = 8 - bitsInBuffer;
        const bitsToTake = Math.min(bitLength, leftoverBitsInBuffer);

        const takenBits = number & ((1 << bitsToTake) - 1);

        numberBuffer |= takenBits << bitsInBuffer;
        number >>= bitsToTake;
        bitLength -= bitsToTake;
        bitsInBuffer += bitsToTake;
        if (bitsInBuffer === 8) {
            byteOutput.push(numberBuffer);
            bitsInBuffer = 0;
            numberBuffer = 0;
        }
        while (bitLength >= 8) {
            byteOutput.push(number & 0xff);
            number >>= 8;
            bitLength -= 8;

        }
        if (bitLength > 0) {
            bitsInBuffer += bitLength;
            numberBuffer = number;
        }
    };

    const getArray = () => {
        // temporarily push numberBuffer to the end byteOutput
        if (bitsInBuffer > 0) {
            byteOutput.push(numberBuffer);
        }
        byteOutput[0] |= bitsInBuffer;
        const output = new Uint8Array(byteOutput);
        // remove numberBuffer from byteOutput
        if (bitsInBuffer > 0) {
            byteOutput.pop();
        }
        return output;
    };
    return [push, getArray] as const;
};

export const buildBitUnpacker = (input: Uint8Array) => {
    let remainingBitsInCurrentByte = 8 - 3;
    let byteIndex = 0;
    const getCurrentByte = () => input[byteIndex];
    const bitsInLastByte = input[0] & 0b111;
    const totalLength = input.length * 8 - 8 + (bitsInLastByte || 8);
    const pull = (neededBits: number): number | null => {
        const bitIndexInCurrentByte = 8 - remainingBitsInCurrentByte;
        const bitIndex = byteIndex * 8 + bitIndexInCurrentByte;
        if (bitIndex + neededBits > totalLength) {
            return null;
        }
        let number = 0;
        const bitsToTake = Math.min(neededBits, remainingBitsInCurrentByte);
        const mask = ((1 << bitsToTake) - 1) << bitIndexInCurrentByte;
        number |= (getCurrentByte() & mask) >> bitIndexInCurrentByte;
        remainingBitsInCurrentByte -= bitsToTake;
        if (remainingBitsInCurrentByte > 0) {
            return number;
        }
        neededBits -= bitsToTake;
        remainingBitsInCurrentByte = 8;
        byteIndex++;
        let shiftAmount = bitsToTake;
        while (neededBits >= 8) {
            number |= getCurrentByte() << shiftAmount;
            byteIndex++;
            shiftAmount += 8;
            neededBits -= 8;
        }
        if (neededBits > 0) {
            remainingBitsInCurrentByte -= neededBits;
            const mask = (1 << neededBits) - 1;
            number |= (getCurrentByte() & mask) << shiftAmount;
        }
        return number;
    };
    return pull;
};