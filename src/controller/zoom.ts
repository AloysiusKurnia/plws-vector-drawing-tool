import { SVGWrapper } from "util/svg-wrapper";
import { Pair } from "util/utility-types";

export interface ZoomAnimationController {
    addOnEveryFrame(callback: () => void): void;
    removeOnEveryFrame(callback: () => void): void;
}

export class ZoomManager {
    private scalePower = 1;
    private centerX = 0;
    private centerY = 0;
    private readonly BASE = 1.2;
    private readonly STANDARD_VIEWBOX_WIDTH = 300;

    constructor(private animationController: ZoomAnimationController) { }

    applyViewBoxTo(wrapper: SVGWrapper): void {
        wrapper.setViewBox(
            this.centerX - this.viewBoxWidth / 2,
            this.centerY - this.viewBoxWidth / 2,
            this.viewBoxWidth,
            this.viewBoxWidth
        );
    }

    private get viewBoxWidth(): number {
        const scale = this.BASE ** this.scalePower;
        return this.STANDARD_VIEWBOX_WIDTH * scale;
    }

    pan(dx: number, dy: number) {
        this.centerX += dx;
        this.centerY += dy;
    }

    translatePosition(
        clientX: number, clientY: number,
        width: number, height: number
    ): Pair<number> {
        const centeredX = clientX - width / 2;
        const centeredY = clientY - height / 2;
        const minDimension = Math.min(width, height);
        const x = centeredX / minDimension * this.viewBoxWidth;
        const y = centeredY / minDimension * this.viewBoxWidth;
        return [x + this.centerX, y + this.centerY];
    }

    translateMovement(
        movementX: number, movementY: number,
        width: number, height: number
    ): Pair<number> {
        const minDimension = Math.min(width, height);
        const x = movementX / minDimension * this.viewBoxWidth;
        const y = movementY / minDimension * this.viewBoxWidth;
        return [x, y];
    }

    zoomIn(): void {
        this.scalePower += 1;
    }

    zoomOut(): void {
        this.scalePower -= 1;
    }

    reset(): void {
        this.scalePower = 1;
    }
}