import { COLOR } from "constants/settings";
import { DrawingElement } from "controllers/element";
import { SplineSegmentView } from "views/component/spline-segment-view";
import { SplineSegmentGroup } from "views/groups/spline-segment-group";
import { EndPoint } from "./end-point";
import { IntermediatePoint } from "./intermediate-point";

export class SplineSegment extends DrawingElement<SplineSegmentView> {
    constructor(
        public endPoint0: EndPoint,
        public intermediatePoint0: IntermediatePoint,
        public intermediatePoint1: IntermediatePoint,
        public endPoint1: EndPoint,
        group: SplineSegmentGroup
    ) {
        super(new SplineSegmentView(group));
        this.updateGraphicsToDefault();
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

