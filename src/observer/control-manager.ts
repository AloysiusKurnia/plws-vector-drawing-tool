import { Canvas } from "canvas";
import { ControlPoint } from "element/elements/control-point";
import { SplineSegment } from "element/elements/spline-segment";
import { AppState, StateTracker } from "state/state";
import { ElementWrapper } from "util/svg-wrapper";
import { ZoomManager } from "./zoom";

export class ControlManager {
    private stateTracker: StateTracker;
    private zoomManager: ZoomManager;
    private stateKeyMapping: Record<string, (state: AppState) => void>;
    private miscKeyMapping: Record<string, () => void>;

    constructor(
        stateTracker: StateTracker,
        zoomManager: ZoomManager,
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
        this.miscKeyMapping = {
            "a": () => this.zoomManager.pan(-10, 0),
            "d": () => this.zoomManager.pan(10, 0),
            "w": () => this.zoomManager.pan(0, -10),
            "s": () => this.zoomManager.pan(0, 10),
            "q": () => this.zoomManager.zoomIn(),
            "e": () => this.zoomManager.zoomOut(),
        };

        document.addEventListener("keydown", (event) => {
            const key = event.key;
            if (key in this.stateKeyMapping) {
                this.stateKeyMapping[key](this.getCurrentState());
            } else if (key in this.miscKeyMapping) {
                this.miscKeyMapping[key]();
            }
        });

        document.addEventListener("keyup", (event) => {
            const key = event.key;
            if (key === "r") {
                this.getCurrentState().onReleaseR();
            }
        });
    }

    registerControlPointClick(point: ControlPoint) {
        point.getElement().addEvent("mousedown",
            () => this.getCurrentState().onControlPointClick(point)
        );
    }

    registerSegmentClick(segment: SplineSegment) {
        segment.getElement().addEvent("mousedown",
            () => this.getCurrentState().onSegmentClick(segment)
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