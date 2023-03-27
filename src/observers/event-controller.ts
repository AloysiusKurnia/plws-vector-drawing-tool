import { AppState, StateTracker } from "state/abstract-state";
import { SVGWrapper } from "util/svg-wrapper";
import { Triple } from "util/utility-types";
import { SVGCanvas } from "views/canvas";
import { EndPoint } from "controllers/components/end-point";
import { SplineSegment } from "controllers/components/spline-segment";
import { ZoomController } from "./zoom-controller";
import { DrawingElement } from "controllers/element";
import { IntermediatePoint } from "controllers/components/intermediate-point";

// TODO: This thing is huge. Maybe split it up into mouse and keyboard
//      controllers?
/**
 * A controller that manages the event loop.
 * This controller is responsible for handling user input.
 */
export class EventController {
    private stateTracker: StateTracker;
    private zoomManager: ZoomController;
    private stateKeyMapping: Record<string, (state: AppState) => void>;
    private zoomForceMapping: Record<string, Triple<number>> = {
        "a": [-1, 0, 0],
        "d": [1, 0, 0],
        "w": [0, -1, 0],
        "s": [0, 1, 0],
        "q": [0, 0, -1],
        "e": [0, 0, 1]
    };


    private readonly lastOffsetPosition = { x: 0, y: 0 };
    private readonly lastCanvasBoundingBox = { width: 0, height: 0 };

    /**
     * Creates a new event controller.
     * @param stateTracker
     * The state tracker that the event controller will use.
     * @param zoomManager
     * The zoom controller that the event controller will use.
     * @param canvas
     * The canvas that the event controller will control.
     */
    constructor(
        stateTracker: StateTracker,
        zoomManager: ZoomController,
        canvas: SVGWrapper
    ) {
        this.stateTracker = stateTracker;
        this.zoomManager = zoomManager;

        this.stateKeyMapping = {
            "Escape": state => state.onEscape(),
            " ": state => state.onSpace(),
            "b": state => state.onLetterB(),
            "r": state => state.onLetterR(),
            "f": state => state.onLetterF(),
            "1": state => state.onNumber1(),
            "2": state => state.onNumber2(),
            "3": state => state.onNumber3(),
            "4": state => state.onNumber4()
        };

        document.addEventListener("keydown", (event) => {
            if (event.repeat) { return; }
            const key = event.key;
            if (key in this.stateKeyMapping) {
                this.stateKeyMapping[key](this.getCurrentState());
            } else if (key in this.zoomForceMapping) {
                const [dx, dy, dZoom] = this.zoomForceMapping[key];
                this.zoomManager.addForce(dx, dy, dZoom);
            }
        });

        document.addEventListener("keyup", (event) => {
            const key = event.key;
            if (key === "r") {
                this.getCurrentState().onReleaseR();
            } else if (key in this.zoomForceMapping) {
                const [dx, dy, dZoom] = this.zoomForceMapping[key];
                this.zoomManager.addForce(-dx, -dy, -dZoom);
            }
        });

        canvas.addEvent('mousedown', (event: MouseEvent) => {
            const [canvasX, canvasY] = this.getCurrentMousePosition(canvas, event);
            this.getCurrentState().onEmptyClick(canvasX, canvasY);
        });

        canvas.addEvent('mousemove', (event: MouseEvent) => {
            const [
                canvasX, canvasY,
                width, height
            ] = this.getCurrentMousePosition(canvas, event);
            this.getCurrentState().onMouseMove(canvasX, canvasY);

            this.lastOffsetPosition.x = event.offsetX;
            this.lastOffsetPosition.y = event.offsetY;
            this.lastCanvasBoundingBox.width = width;
            this.lastCanvasBoundingBox.height = height;
        });

        zoomManager.doOnPanning(() => {
            const [canvasX, canvasY] = this.zoomManager.translatePosition(
                this.lastOffsetPosition.x,
                this.lastOffsetPosition.y,
                this.lastCanvasBoundingBox.width,
                this.lastCanvasBoundingBox.height
            );
            this.getCurrentState().onMouseMove(canvasX, canvasY);
        });

        canvas.addEvent('mouseup', (event: MouseEvent) => {
            const [canvasX, canvasY] = this.getCurrentMousePosition(canvas, event);
            this.getCurrentState().onMouseUp(canvasX, canvasY);
        });
    }

    private getCurrentMousePosition(canvas: SVGWrapper, event: MouseEvent) {
        const elemX = event.offsetX;
        const elemY = event.offsetY;
        const { width, height } = canvas.getBoundingBox();
        const [canvasX, canvasY] = this.zoomManager.translatePosition(elemX, elemY, width, height);
        return [canvasX, canvasY, width, height];
    }

    private registerElementMouseEvent<T extends DrawingElement>(
        drawElement: T,
        onMouseDown: (currentState: AppState, element: T) => void,
        onMouseEnter: (currentState: AppState, element: T) => void,
        onMouseLeave: (currentState: AppState, element: T) => void
    ) {
        const view = drawElement.getElement();
        view.addEvent("mousedown",
            (event) => {
                event.stopPropagation();
                onMouseDown(this.getCurrentState(), drawElement);
            }
        );
        view.addEvent("mouseenter",
            () => {
                onMouseEnter(this.getCurrentState(), drawElement);
            }
        );
        view.addEvent("mouseleave",
            () => {
                onMouseLeave(this.getCurrentState(), drawElement);
            }
        );
    }

    /**
     * Registers the mouse events for the given end point.
     * @param point The end point to register the events for.
     */
    registerEndpointEvents(point: EndPoint) {
        this.registerElementMouseEvent(point,
            (state, point) => { state.onEndPointClick(point); },
            (state, point) => { state.onEndPointEnter(point); },
            (state, point) => { state.onEndPointLeave(point); }
        );
    }

    /**
     * Registers the mouse events for the given spline segment.
     * @param segment The spline segment to register the events for.
     */
    registerSegmentEvents(segment: SplineSegment) {
        this.registerElementMouseEvent(segment,
            (state, segment) => { state.onSegmentClick(segment); },
            (state, segment) => { state.onSegmentEnter(segment); },
            (state, segment) => { state.onSegmentLeave(segment); }
        );
    }

    /**
     * Registers the mouse events for the given intermediate point.
     * @param point The intermediate point to register the events for.
     */
    registerIntermediatePointEvents(point: IntermediatePoint) {
        this.registerElementMouseEvent(point,
            (state, point) => { state.onIntermediatePointClick(point); },
            (state, point) => { state.onIntermediatePointEnter(point); },
            (state, point) => { state.onIntermediatePointLeave(point); }
        );
    }

    /**
     * Registers the mouse events for the canvas.
     * @param canvas The canvas to register the events for.
     */
    registerCanvasClick(canvas: SVGCanvas) {
        canvas.addEvent("mousedown",
            (event: MouseEvent) => {
                const x = event.offsetX;
                const y = event.offsetY;
                this.getCurrentState().onEmptyClick(x, y);
            }
        );
    }

    private getCurrentState(): AppState {
        return this.stateTracker.getCurrentState();
    }
}