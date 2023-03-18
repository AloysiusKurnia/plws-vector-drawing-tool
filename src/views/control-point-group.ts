import { GroupWrapper } from "util/svg-wrapper";
import { ControlPointView } from "./control-point-view";

export class ControlPointGroup extends GroupWrapper {
    constructor() {
        super();
    }

    createControlPoint() {
        const controlPoint = new ControlPointView();
        controlPoint.appendTo(this);
        return controlPoint;
    }
}