import { SVGWrapper } from "util/svg-wrapper";
import { Pair, Procedure } from "util/utility-types";
import { AnimationFrameController } from "./animation-frame-controller";

/**
 * A controller that manages the zooming and panning of the canvas.
 */
export class ZoomController {
    private scalePower = 1;
    private centerX = 0;
    private centerY = 0;

    readonly DEFAULT_SCALE_FACTOR: number;
    private readonly BASE = 1.2;
    private readonly STANDARD_VIEWBOX_WIDTH = 300;
    private readonly PAN_AMOUNT_PER_FRAME = 7;
    private readonly ZOOM_AMOUNT_PER_FRAME = 0.1;

    private dx = 0;
    private dy = 0;
    private dZoom = 0;
    private toBeDoneOnPan = [] as Procedure[];

    /**
     * Creates a new zoom controller.
     * @param animationController
     * The animation frame controller that the zoom controller will use.
     * @param svg
     * The SVG wrapper that will use the zoom controller.
     */
    constructor(
        private animationController: AnimationFrameController,
        private svg: SVGWrapper,
    ) {
        this.animationController.register(() => this.updateIfMoving());
        this.DEFAULT_SCALE_FACTOR = this.getScaleFactor();
        this.update();
    }

    /**
     * Adds a movement to the zoom controller's queue. Think of it as nudging
     * the camera instantaneously on a space without friction.
     * @param dx How much force given horizontally.
     * @param dy How much force given vertically.
     * @param dZoom How much force given to zoom.
     */
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

        this.toBeDoneOnPan.forEach((procedure) => procedure());
    }

    private get viewBoxWidth(): number {
        return this.STANDARD_VIEWBOX_WIDTH * this.getScaleFactor();
    }

    /**
     * Returns the current scale factor.
     */
    // TODO: Instead of returning this number, adjust it with the default
    // scale factor.
    getScaleFactor(): number {
        return this.BASE ** this.scalePower;
    }

    /**
     * Translates a position on the screen to a position on the canvas.
     * @param clientX The x coordinate of the position on the screen.
     * @param clientY The y coordinate of the position on the screen.
     * @param width The width of the screen.
     * @param height The height of the screen.
     */
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

    /**
     * Registers a procedure to be called when the canvas is panned.
     * @param callback The procedure to register.
     */
    doOnPanning(callback: () => void): void {
        this.toBeDoneOnPan.push(callback);
    }
}