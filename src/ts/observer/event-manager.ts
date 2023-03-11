import { ControlPoint } from "element/elements/control-point";
import { SplineSegment } from "element/elements/spline-segment";
import { Selectable } from "selection-manager/selectable";
import { StateTracker } from "state/state";
import { ZoomManager } from "./zoom";

export class EventManager {
    private stateTracker: StateTracker;
    private zoomManager: ZoomManager;

    constructor(stateTracker: StateTracker, zoomManager: ZoomManager) {
        this.stateTracker = stateTracker;
        this.zoomManager = zoomManager;
    }

    onControlPointClick(point: ControlPoint) {
        this.stateTracker.onControlPointClick(point);
    }

    onSegmentClick(segment: SplineSegment) {
        this.stateTracker.onSegmentClick(segment);
    }
}