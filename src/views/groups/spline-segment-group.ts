import { DIMENSION } from "constants/settings";
import { AbstractGroup } from "./abstract-group";

export class SplineSegmentGroup extends AbstractGroup {
    constructor() {
        super();
        this.setFill('none');
        this.style.strokeLinecap = 'round';
        this.style.strokeWidth = `${DIMENSION.segmentWidth}`;
    }

    rescale(zoomFactor: number): void {
        this.style.strokeWidth = `${DIMENSION.segmentWidth * zoomFactor / this.defaultScaleFactor}`;
    }
}