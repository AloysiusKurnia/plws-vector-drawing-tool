export interface Selectable {
    updateGraphicsToHovered(): void;
    updateGraphicsToDefault(): void;
    drag(dx: number, dy: number): void;
}