import { ControlPoint } from "element/elements/control-point";
import { SplineSegment } from "element/elements/spline-segment";
import { ControlManager } from "observer/event-manager";

type MaybeAppState = AppState | undefined;

export abstract class AppState {
    onControlPointClick(point: ControlPoint): MaybeAppState { return undefined; }
    onSegmentClick(segment: SplineSegment): MaybeAppState { return undefined; }
    onMouseMove(x: number, y: number): MaybeAppState { return undefined; }
    onEscape(): MaybeAppState { return undefined; }
    onSpace(): MaybeAppState { return undefined; }
    onLetterB(): MaybeAppState { return undefined; }
    onLetterR(): MaybeAppState { return undefined; }
    onReleaseR(): MaybeAppState { return undefined; }
    onLetterF(): MaybeAppState { return undefined; }
    onNumber1(): MaybeAppState { return undefined; }
    onNumber2(): MaybeAppState { return undefined; }
    onNumber3(): MaybeAppState { return undefined; }
    onNumber4(): MaybeAppState { return undefined; }
}