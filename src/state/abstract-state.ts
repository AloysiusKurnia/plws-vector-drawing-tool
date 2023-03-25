import { EndPoint } from "controllers/components/end-point";
import { IntermediatePoint } from "controllers/components/intermediate-point";
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
    
    /* eslint-disable @typescript-eslint/no-unused-vars */
    /* eslint-disable @typescript-eslint/no-empty-function */
    onEndPointClick(point: EndPoint) { }
    onSegmentClick(segment: SplineSegment) { }
    onIntermediatePointClick(point: IntermediatePoint) { }

    onEndPointEnter(point: EndPoint) { }
    onSegmentEnter(segment: SplineSegment) { }
    onIntermediatePointEnter(point: IntermediatePoint) { }

    onEndPointLeave(point: EndPoint) { }
    onSegmentLeave(segment: SplineSegment) { }
    onIntermediatePointLeave(point: IntermediatePoint) { }
    
    onEmptyClick(x: number, y: number) { }
    onMouseMove(x: number, y: number) { }
    onMouseUp(x: number, y: number) { }

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
    /* eslint-enable @typescript-eslint/no-unused-vars */
    /* eslint-enable @typescript-eslint/no-empty-function */
}

export interface StateTracker {
    getCurrentState(): AppState;
    setCurrentState(state: AppState): void;
}