import { DIMENSION } from "constants/settings";
import { AbstractGroup } from "./abstract-group";

export class SplineSegmentGroup extends AbstractGroup {
    constructor() {
        super();
        this.setFill('none');
        this.style.strokeLinecap = 'round';
        this.style.strokeWidth = `${DIMENSION.segmentWidth}`;
    }

    override rescale(zoomFactor: number): void {
        const factor = zoomFactor / this.defaultScaleFactor;
        this.style.strokeWidth = `${DIMENSION.segmentWidth * factor}`;
    }
}