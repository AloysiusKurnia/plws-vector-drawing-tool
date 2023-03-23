import { SVGWrapper } from "util/svg-wrapper";
import { Pair, Procedure } from "util/utility-types";
import { AnimationFrameController } from "./animation-frame-controller";

export class ZoomController {
    private scalePower = 1;
    private centerX = 0;
    private centerY = 0;

    private readonly BASE = 1.2;
    private readonly STANDARD_VIEWBOX_WIDTH = 300;
    private readonly PAN_AMOUNT_PER_FRAME = 7;
    private readonly ZOOM_AMOUNT_PER_FRAME = 0.1;

    private dx = 0;
    private dy = 0;
    private dZoom = 0;
    private toBeDoneOnPan = () => { };

    constructor(
        private animationController: AnimationFrameController,
        private svg: SVGWrapper,
    ) {
        this.animationController.register(() => this.updateIfMoving());
        this.update();
    }

    addForce(
        dx: number,
        dy: number,
        dZoom: number,
    ) {
        this.dx += dx;
        this.dy += dy;
        this.dZoom += dZoom;
    }

    private updateIfMoving(): void {
        if (this.dx === 0 && this.dy === 0 && this.dZoom === 0) {
            return;
        }
        this.update();
    }

    private update() {
        const scale = this.getScaleFactor();
        this.centerX += this.dx * this.PAN_AMOUNT_PER_FRAME * scale;
        this.centerY += this.dy * this.PAN_AMOUNT_PER_FRAME * scale;
        this.scalePower += this.dZoom * this.ZOOM_AMOUNT_PER_FRAME;

        this.svg.setViewBox(
            this.centerX - this.viewBoxWidth / 2,
            this.centerY - this.viewBoxWidth / 2,
            this.viewBoxWidth,
            this.viewBoxWidth
        );

        this.toBeDoneOnPan();
    }

    private get viewBoxWidth(): number {
        return this.STANDARD_VIEWBOX_WIDTH * this.getScaleFactor();
    }

    getScaleFactor(): number {
        return this.BASE ** this.scalePower;
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

    doOnPanning(callback: () => void): void {
        this.toBeDoneOnPan = callback;
    }
}