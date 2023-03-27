/** Any view that can change its graphics. */
export interface ChangeableGraphics {
    /** Changes the graphics to the hovered state. */
    graphicsToHovered(): void;
    /** Changes the graphics to the default state. */
    graphicsToDefault(): void;
    /** Changes the graphics to the selected state. */
    graphicsToSelected(): void;
}