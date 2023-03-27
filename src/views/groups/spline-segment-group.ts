import { DIMENSION } from "constants/settings";
import { AbstractGroup } from "./abstract-group";

/** A group that contains spline segment elements. */
export class SplineSegmentGroup extends AbstractGroup {
    /** Creates a spline segment group. */
    constructor() {
        super();
        this.setFill('none');
        this.style.strokeLinecap = 'round';
        this.style.strokeWidth = `${DIMENSION.segmentWidth}`;
    }

    override rescale(zoomFactor: number): void {
        this.style.strokeWidth = `${DIMENSION.segmentWidth * zoomFactor}`;
    }
}