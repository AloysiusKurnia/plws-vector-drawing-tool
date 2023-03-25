import { EndPoint } from "controllers/components/end-point";
import { IntermediatePoint } from "controllers/components/intermediate-point";
import { AppState, StateTracker } from "state/abstract-state";
import { StateFactory } from "state/state-factory";
import { Pointlike } from "util/utility-types";

export class IntermediatePointSelectedState extends AppState {
    private dragging = true;
    constructor(tracker: StateTracker, factory: StateFactory, private intermediatePoint: IntermediatePoint) {
        super(tracker, factory);
        intermediatePoint.makeSelected();
    }

    override onMouseMove(x: number, y: number): void {
        if (this.dragging) {
            this.intermediatePoint.copyFrom({ x, y });
            this.intermediatePoint.updateView();
            this.intermediatePoint.owner.updateView();
        }
    }

    override onMouseUp(): void {
        this.dragging = false;
    }

    private aboutToExit(): void {
        this.intermediatePoint.makeDeslected();
        this.intermediatePoint.makeHidden();
        for (const intermediatePoint of this.intermediatePoint.endPoint.getIntermediatePoints()) {
            intermediatePoint.makeHidden();
        }
    }

    override onEscape(): void {
        this.aboutToExit();
        this.changeState(this.factory.idle());
    }

    override onEmptyClick(_x: number, _y: number): void {
        this.aboutToExit();
        this.changeState(this.factory.idle());
    }

    override onIntermediatePointClick(intermediatePoint: IntermediatePoint): void {
        if (intermediatePoint === this.intermediatePoint) {
            this.dragging = true;
        } else {
            this.intermediatePoint.makeDeslected();
            this.changeState(this.factory.intermediatePointSelected(intermediatePoint));
        }
    }

    override onEndPointClick(endPoint: EndPoint): void {
        this.intermediatePoint.makeDeslected();
        this.aboutToExit();
        this.changeState(this.factory.endPointSelected(endPoint));
    }
}