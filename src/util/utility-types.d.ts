/** A pair of values of the same type. */
export type Pair<T> = [T, T];
/** A triple of values of the same type. */
export type Triple<T> = [T, T, T];
/** A quadruple of values of the same type. */
export type Quadruple<T> = [T, T, T, T];
/** Function that takes no arguments and returns nothing. */
export type Procedure = () => void;
/** An immutable point. */
export interface Pointlike {
    /** The x-coordinate of the point. */
    readonly x: number;
    /** The y-coordinate of the point. */
    readonly y: number;
}