import { EndPoint } from "models/components/end-point";
import { SplineSegment } from "models/components/spline-segment";
import { AppState } from "state/state";

export class IdleState extends AppState {
    private selected: SplineSegment | EndPoint | null = null;

    override onSpace(): void {
        if (this.selected instanceof SplineSegment) {
            // TODO: Drag the selected segment
        } else if (this.selected instanceof EndPoint) {
            // TODO: Drag the selected control point
        } else {
            const newState = this.factory.drawInit();
            this.changeState(newState);
        }
    }

    override onLetterB(): void {
        if (this.selected instanceof SplineSegment) {
            // TODO: split the selected segment
        } else if (this.selected instanceof EndPoint) {
            // TODO: drag the selected control point along the segment
        }
    }

    
}