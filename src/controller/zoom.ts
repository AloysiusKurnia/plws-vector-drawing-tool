import { SVGWrapper } from "util/svg-wrapper";
import { Pair } from "util/utility-types";
import { AnimationFrameController } from "./animation-frame-controller";

export class ZoomController {
    private scalePower = 1;
    private centerX = 0;
    private centerY = 0;

    private readonly BASE = 1.2;
    private readonly STANDARD_VIEWBOX_WIDTH = 300;
    private readonly PAN_AMOUNT_PER_FRAME = 10;
    private readonly ZOOM_AMOUNT_PER_FRAME = 0.1;

    private dx = 0;
    private dy = 0;
    private dZoom = 0;
    constructor(
        private animationController: AnimationFrameController,
        private svg: SVGWrapper,
    ) {
        this.animationController.register(() => this.update());
    }

    addForce(
        dx: -1 | 0 | 1,
        dy: -1 | 0 | 1,
        dZoom: -1 | 0 | 1,
    ) {
        this.dx += dx;
        this.dy += dy;
        this.dZoom += dZoom;
    }

    private update() {
        this.centerX += this.dx * this.PAN_AMOUNT_PER_FRAME;
        this.centerY += this.dy * this.PAN_AMOUNT_PER_FRAME;
        this.scalePower += this.dZoom * this.ZOOM_AMOUNT_PER_FRAME;

        this.svg.setViewBox(
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