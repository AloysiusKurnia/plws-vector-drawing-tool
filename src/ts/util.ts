export type Indexable<T> = {
    [index: number]: T;
    length: number;
};

type FullBinaryTree<T> = [FullBinaryTree<T>, FullBinaryTree<T>] | T;

export const printFullBinaryTree = <T>(
    tree: FullBinaryTree<T>,
    stringify: (node: T) => string = (node) => {
        if (typeof node === 'object' && node !== null) {
            return node.toString();
        } else if (node === undefined) {
            return 'undefined';
        } else {
            return JSON.stringify(node);
        }
    },
    isNotLeaf:
        (node: FullBinaryTree<T>) => node is [FullBinaryTree<T>, FullBinaryTree<T>]
        = (node): node is [FullBinaryTree<T>, FullBinaryTree<T>] => Array.isArray(node),
) => {
    const printNode = (node: FullBinaryTree<T>, depth: number) => {
        if (isNotLeaf(node)) {
            const [l, r] = node;
            printNode(l, depth + 1);
            printNode(r, depth + 1);
        } else {
            console.log(' '.repeat(depth), stringify(node));
        }
    };
    printNode(tree, 0);
};