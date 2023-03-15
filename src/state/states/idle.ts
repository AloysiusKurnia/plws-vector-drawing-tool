import { AppState } from "state/state";
import { ControlPoint } from "views/components/control-point";
import { SplineSegment } from "views/components/spline-segment";
import { DrawInitState } from "./draw-init";

export class IdleState extends AppState {
    private selected: SplineSegment | ControlPoint | null = null;

    override onSpace(): void {
        if (this.selected instanceof SplineSegment) {
            // TODO: Drag the selected segment
        } else if (this.selected instanceof ControlPoint) {
            // TODO: Drag the selected control point
        } else {
            const newState = new DrawInitState(this.stateTracker);
            this.changeState(newState);
        }
    }

    override onLetterB(): void {
        if (this.selected instanceof SplineSegment) {
            // TODO: split the selected segment
        } else if (this.selected instanceof ControlPoint) {
            // TODO: drag the selected control point along the segment
        }
    }

    
}