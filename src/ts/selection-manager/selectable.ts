export interface Selectable {
    updateGraphicsToSelected(): void;
    updateGraphicsToDeselected(): void;
    drag(dx: number, dy: number): void;
}