import { EndPoint } from "controllers/components/end-point";
import { SplineSegment } from "controllers/components/spline-segment";
import { StateFactory } from "./state-factory";

export abstract class AppState {
    constructor(
        protected readonly stateTracker: StateTracker,
        protected readonly factory: StateFactory
    ) { }

    protected changeState(state: AppState) {
        this.stateTracker.setCurrentState(state);
    }

    // These are to be overridden by the child classes. By default, they do nothing.

    onControlPointClick(point: EndPoint) { }
    onSegmentClick(segment: SplineSegment) { }
    onEmptyClick(x: number, y: number) { }
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