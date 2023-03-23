import { BezierWrapper } from "util/svg-wrapper";
import { Pointlike } from "util/utility-types";
import { SplineSegmentGroup } from "../groups/spline-segment-group";

export class SplineSegmentView extends BezierWrapper {
    private isHidden = true;
    constructor(group: SplineSegmentGroup) {
        super();
        group.add(this);
        this.makeHidden();
    }

    override set endpoint1(point: Pointlike) {
        super.endpoint1 = point;
        // While the mouse hasn't moved, the spline segment is hidden.
        // Otherwise there will be a dot at (0, 0).
        if (this.isHidden) {
            this.makeShown();
            this.isHidden = false;
        }
    }
}