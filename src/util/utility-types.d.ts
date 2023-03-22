export type Pair<T> = [T, T];
export type Triple<T> = [T, T, T];
export type Quadruple<T> = [T, T, T, T];
export type Procedure = () => void;
export interface Pointlike {
    readonly x: number;
    readonly y: number;
}