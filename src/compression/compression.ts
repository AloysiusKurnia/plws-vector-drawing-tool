import { buildBitPacker, buildBitUnpacker } from "./byte";

const ESCAPE_CHAR_1 = '\u0000';
const ESCAPE_CHAR_2 = '\u0001';

export const lzssEncode = (
    str: string,
) => {
    if (str.includes(ESCAPE_CHAR_1)) {
        throw new Error(`The string to be encoded cannot contain the escape character ${ESCAPE_CHAR_1}`);
    }
    if (str.includes(ESCAPE_CHAR_2)) {
        throw new Error(`The string to be encoded cannot contain the escape character ${ESCAPE_CHAR_2}`);
    }
    const searchBufferSize = 2 ** 10;
    const lookaheadSize = 2 ** 6;
    const output: string[] = [];
    const dictionary: number[] = [];
    let cursor = 0;
    while (cursor < str.length) {
        const searchBuffer = str.substring(cursor - searchBufferSize, cursor);

        let matchLength = 3;
        let bestOffset = NaN;
        while (matchLength < lookaheadSize) {
            if (cursor + matchLength >= str.length) {
                break;
            }
            const toBeFound = str.substring(cursor, cursor + matchLength);
            const matchIndex = searchBuffer.lastIndexOf(toBeFound);
            if (matchIndex === -1) {
                break;
            }
            bestOffset = searchBuffer.length - matchIndex;
            matchLength++;
        }
        matchLength--;

        if (!Number.isNaN(bestOffset)) {
            // console.log(
            //     `${cursor}: Compressed ${JSON.stringify(str.substring(cursor, cursor + matchLength - 1))}`
            //     + ` with offset ${offset} and length ${matchLength - 1} (...`
            //     + JSON.stringify(str.substring(cursor - offset - 3, cursor - offset)).slice(1, -1)
            //     + '[' + JSON.stringify(str.substring(cursor - offset, cursor - offset + 3)).slice(1, -1)
            //     + ']...)'
            // );

            if (bestOffset < 2 ** 6 + 1 && matchLength < 2 ** 2 + 3) {
                output.push(ESCAPE_CHAR_2);
                const merged = (bestOffset - 1) | ((matchLength - 3) << 6);
                dictionary.push(merged);
            } else {
                output.push(ESCAPE_CHAR_1);
                dictionary.push(
                    (bestOffset - 1) & 0xff,
                    (matchLength - 3) << 2 | ((bestOffset - 1) >> 8)
                );
            }
            cursor += matchLength;
        } else {
            output.push(str[cursor]);
            // console.log(`${cursor}: Literal '${str[cursor]}'`);
            cursor++;
        }
    }
    return [output.join(''), new Uint8Array(dictionary)] as const;
};

export const lzssDecode = (
    encoded: string,
    dictionary: Uint8Array,
) => {
    const output: string[] = [];
    let cursor = 0;
    let dictionaryCursor = 0;
    while (cursor < encoded.length) {
        if (encoded[cursor] === ESCAPE_CHAR_1) {
            const i1 = dictionary[dictionaryCursor++];
            const i2 = dictionary[dictionaryCursor++];
            const length = (i2 >> 2) + 3;
            const offset = (((i2 & 0x3) << 8) | i1) + 1;

            for (let i = 0; i < length; i++) {
                output.push(output[output.length - offset]);
            }
        } else if (encoded[cursor] === ESCAPE_CHAR_2) {
            const merged = dictionary[dictionaryCursor++];
            const offset = (merged & 0x3f) + 1;
            const length = (merged >> 6) + 3;

            for (let i = 0; i < length; i++) {
                output.push(output[output.length - offset]);
            }
        } else {
            output.push(encoded[cursor]);
        }
        cursor++;

    }
    return output.join('');
};

type CountingHuffmanNode = [number, CountingHuffmanNode, CountingHuffmanNode] | [number, string];
export type HuffmanNode = [HuffmanNode, HuffmanNode] | string;

export const huffmanEncode = (
    str: string
) => {
    const charCount = {} as Record<string, number>;
    for (const char of str) {
        charCount[char] = (charCount[char] ?? 0) + 1;
    }
    const frequencyList = [] as CountingHuffmanNode[];
    for (const char in charCount) {
        frequencyList.push([charCount[char], char]);
    }
    frequencyList.sort((a, b) => a[0] - b[0]);
    const getHuffmanNodeStringSet = (node: CountingHuffmanNode): string => {
        if (node.length === 3) {
            return getHuffmanNodeStringSet(node[1]) + getHuffmanNodeStringSet(node[2]);
        } else {
            return node[1];
        }
    };
    while (frequencyList.length > 1) {
        const a = frequencyList.shift()!;
        const b = frequencyList.shift()!;
        const combined = [a[0] + b[0], a, b] as CountingHuffmanNode;
        const where = frequencyList.findIndex(([freq]) => freq > combined[0]);
        if (where === -1) {
            frequencyList.push(combined);
        } else {
            frequencyList.splice(where, 0, combined);
        }
    }
    const tree = frequencyList[0];
    const codeMap = {} as Record<string, [number, number]>;

    const traverse = (
        node: CountingHuffmanNode,
        code: number,
        length: number
    ): HuffmanNode => {
        if (node.length === 3) {
            const l = traverse(node[1], code, length + 1);
            const r = traverse(node[2], code | (1 << length), length + 1);
            return [l, r];
        } else {
            codeMap[node[1]] = [code, length];
            return node[1];
        }
    };
    const outputTree = traverse(tree, 0, 0);
    const [pack, finalize] = buildBitPacker();
    for (const chr of str) {
        const [code, length] = codeMap[chr];
        pack(code, length);
    }
    return [
        finalize(),
        packNullStringArr(huffmanTreeToArray(outputTree))
    ] as const;
};

export const huffmanDecode = (
    encoded: Uint8Array,
    packedTree: Uint8Array
) => {
    const tree = huffmanTreeFromArray(unpackNullStringArr(packedTree));
    const output: string[] = [];
    let node = tree;
    const pull = buildBitUnpacker(encoded);
    while (true) {
        const bit = pull(1);
        if (bit === null) {
            break;
        }
        if (bit === 0) {
            node = node[0];
        } else {
            node = node[1];
        }

        if (typeof node === 'string') {
            output.push(node);
            node = tree;
        }
    }
    return output.join('');
};

const huffmanTreeToArray = (
    tree: HuffmanNode
) => {
    const output: (string | null)[] = [];
    const traverse = (node: HuffmanNode) => {
        if (typeof node === 'string') {
            output.push(node);
        } else {
            output.push(null);
            traverse(node[0]);
            traverse(node[1]);
        }
    };
    traverse(tree);
    return output;
};

const huffmanTreeFromArray = (
    arr: (string | null)[]
) => {
    let i = 0;
    const traverse = (): HuffmanNode => {
        if (arr[i] === null) {
            i++;
            return [traverse(), traverse()];
        } else {
            return arr[i++] as string;
        }
    };
    return traverse();
};

const packNullStringArr = (
    arr: (string | null)[]
) => {
    const [pack, finalize] = buildBitPacker();
    const encoder = new TextEncoder();
    for (const item of arr) {
        if (item === null) {
            pack(0, 1);
        } else {
            pack(1, 1);
            const bytes = encoder.encode(item);
            for (const byte of bytes) {
                pack(byte, 8);
            }
        }
    }
    return finalize();
};

const unpackNullStringArr = (
    encoded: Uint8Array
) => {
    const output: (string | null)[] = [];
    const pull = buildBitUnpacker(encoded);
    const decoder = new TextDecoder();
    while (true) {
        const isString = pull(1);
        if (isString === null) {
            break;
        }
        if (isString === 0) {
            output.push(null);
        } else {
            const firstByte = pull(8)!;
            const bytes = [firstByte];
            if (firstByte & 0b1000_0000) {
                let mask = 0b0010_0000;
                bytes.push(pull(8)!);

                while (firstByte & mask) {
                    bytes.push(pull(8)!);
                    mask >>= 1;
                }
            }
            output.push(decoder.decode(new Uint8Array(bytes)));
        }
    }
    return output;
};