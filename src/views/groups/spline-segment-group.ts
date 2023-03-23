import { GroupWrapper } from "util/svg-wrapper";

export class SplineSegmentGroup extends GroupWrapper {
    constructor() {
        super();
        this.setFill('none');
        this.style.strokeLinecap = 'round';
    }
}