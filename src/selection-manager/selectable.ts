export interface Selectable {
    updateGraphicsToHovered(): void;
    updateGraphicsToUnhovered(): void;
    drag(dx: number, dy: number): void;
}