import { ControlPoint } from "element/elements/control-point";
import { SplineSegment } from "element/elements/spline-segment";

export abstract class AppState {
    constructor(private stateTracker: StateTracker) { }
    protected changeState(state: AppState) {
        this.stateTracker.setCurrentState(state);
    }

    onControlPointClick(point: ControlPoint) { }
    onSegmentClick(segment: SplineSegment) { }
    onMouseMove(x: number, y: number) { }
    onEscape() { }
    onSpace() { }
    onLetterB() { }
    onLetterR() { }
    onReleaseR() { }
    onLetterF() { }
    onNumber1() { }
    onNumber2() { }
    onNumber3() { }
    onNumber4() { }
}

export interface StateTracker {
    getCurrentState(): AppState;
    setCurrentState(state: AppState): void;
}