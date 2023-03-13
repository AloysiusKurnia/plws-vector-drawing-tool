import { ControlPoint } from "element/elements/control-point";
import { SplineSegment } from "element/elements/spline-segment";
import { StateTracker } from "state/state";
import { ZoomManager } from "./zoom";

export class ControlManager {
    private stateTracker: StateTracker;
    private zoomManager: ZoomManager;

    constructor(stateTracker: StateTracker, zoomManager: ZoomManager) {
        this.stateTracker = stateTracker;
        this.zoomManager = zoomManager;

        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "Escape":
                    this.getCurrentState().onEscape();
                    break;
                case " ":
                    this.getCurrentState().onSpace();
                    break;
                case "b":
                    this.getCurrentState().onLetterB();
                    break;
                case "r":
                    this.getCurrentState().onLetterR();
                    break;
                case "f":
                    this.getCurrentState().onLetterF();
                    break;
                case "1":
                    this.getCurrentState().onNumber1();
                    break;
                case "2":
                    this.getCurrentState().onNumber2();
                    break;
                case "3":
                    this.getCurrentState().onNumber3();
                    break;
                case "4":
                    this.getCurrentState().onNumber4();
                    break;
            }
        });
    }

    onControlPointClick(point: ControlPoint) {
        this.getCurrentState().onControlPointClick(point);
    }

    onSegmentClick(segment: SplineSegment) {
        this.getCurrentState().onSegmentClick(segment);
    }

    private getCurrentState() {
        return this.stateTracker.getCurrentState();
    }
}