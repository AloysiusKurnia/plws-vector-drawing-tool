import { GroupWrapper } from "util/svg-wrapper";
import { EndPointView } from "./end-point-view";

export class EndPointGroup extends GroupWrapper {
    constructor() {
        super();
    }

    createControlPoint() {
        const controlPoint = new EndPointView();
        controlPoint.appendTo(this);
        return controlPoint;
    }
}