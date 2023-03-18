import { GroupWrapper } from "util/svg-wrapper";
import { ControlPointView } from "./control-point-view";

export class ControlPointGroup extends GroupWrapper {
    constructor() {
        super();
    }

    createControlPoint(x: number, y: number) {
        const controlPoint = new ControlPointView(x, y);
        controlPoint.appendTo(this);
        return controlPoint;
    }
}