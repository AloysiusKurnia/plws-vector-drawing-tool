import { AppState, StateTracker } from "state/state";
import { SVGWrapper } from "util/svg-wrapper";
import { Triple } from "util/utility-types";
import { Canvas } from "views/canvas";
import { ControlPoint } from "models/components/control-point";
import { SplineSegment } from "models/components/spline-segment";
import { ZoomController } from "./zoom";

export class ControlManager {
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

    private toBeDoneOnEveryFrame: Record<number, () => void> = {};

    private readonly lastMousePosition = { x: 0, y: 0 };

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

        requestAnimationFrame(() => {
            for (const key in this.toBeDoneOnEveryFrame) {
                this.toBeDoneOnEveryFrame[key]();
            }
        });

        canvas.addEvent('mousedown', (event: MouseEvent) => {
            const elemX = event.offsetX;
            const elemY = event.offsetY;
            const { width, height } = canvas.getBoundingBox();
            const [canvasX, canvasY] = this.zoomManager.translatePosition(elemX, elemY, width, height);
            this.getCurrentState().onEmptyClick(canvasX, canvasY);
        });

        canvas.addEvent('mousemove', (event: MouseEvent) => {
            const elemX = event.offsetX;
            const elemY = event.offsetY;
            const { width, height } = canvas.getBoundingBox();
            const [canvasX, canvasY] = this.zoomManager.translatePosition(elemX, elemY, width, height);
            this.getCurrentState().onMouseMove(canvasX, canvasY);

            this.lastMousePosition.x = canvasX;
            this.lastMousePosition.y = canvasY;
        });
    }


    registerControlPointClick(point: ControlPoint) {
        point.getElement().addEvent("mousedown",
            (event) => {
                event.stopPropagation();
                this.getCurrentState().onControlPointClick(point);
            }
        );
    }

    registerSegmentClick(segment: SplineSegment) {
        segment.getElement().addEvent("mousedown",
            (event) => {
                event.stopPropagation();
                this.getCurrentState().onSegmentClick(segment);
            }
        );
    }

    registerCanvasClick(canvas: Canvas) {
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