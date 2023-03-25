import { COLOR } from "constants/settings";
import { DrawingElement } from "controllers/element";
import { SplineSegmentView } from "views/component/spline-segment-view";
import { IntermediatePointGroup } from "views/groups/intermediate-point-group";
import { SplineSegmentGroup } from "views/groups/spline-segment-group";
import { EndPoint } from "./end-point";
import { IntermediatePoint } from "./intermediate-point";

export class SplineSegment extends DrawingElement<SplineSegmentView> {
    public readonly intermediatePoint0: IntermediatePoint;
    public readonly intermediatePoint1: IntermediatePoint;
    private endPoint0_: EndPoint;
    private endPoint1_: EndPoint;
    constructor(
        endPoint0: EndPoint, endPoint1: EndPoint,
        group: SplineSegmentGroup, intermediatePointGroup: IntermediatePointGroup,
    ) {
        super(new SplineSegmentView(group));
        this.endPoint0_ = endPoint0;
        this.endPoint1_ = endPoint1;
        this.intermediatePoint0 = new IntermediatePoint(endPoint0, this, intermediatePointGroup);
        this.intermediatePoint1 = new IntermediatePoint(endPoint1, this, intermediatePointGroup);
        this.updateGraphicsToDefault();
    }

    get endPoint0(): EndPoint { return this.endPoint0_; }
    set endPoint0(endPoint: EndPoint) {
        this.endPoint0_ = endPoint;
        this.intermediatePoint0.endPoint = endPoint;
    }

    get endPoint1(): EndPoint { return this.endPoint1_; }
    set endPoint1(endPoint: EndPoint) {
        this.endPoint1_ = endPoint;
        this.intermediatePoint1.endPoint = endPoint;
    }

    updateGraphicsToHovered(): void {
        this.viewElement.setStroke(COLOR.lightBlack);
    }

    updateGraphicsToDefault(): void {
        this.viewElement.setStroke(COLOR.black);
    }

    updateView() {
        this.viewElement.endpoint0 = this.endPoint0;
        this.viewElement.endpoint1 = this.endPoint1;
        this.viewElement.intermediatePoint0 = this.intermediatePoint0;
        this.viewElement.intermediatePoint1 = this.intermediatePoint1;
        this.viewElement.update();

        this.intermediatePoint0.updateView();
        this.intermediatePoint1.updateView();
    }

    override removeElement(): void {
        this.intermediatePoint0.removeElement();
        this.intermediatePoint1.removeElement();
        super.removeElement();
    }
}

