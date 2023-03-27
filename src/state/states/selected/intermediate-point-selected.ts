import { IntermediatePoint } from "controllers/components/intermediate-point";
import { StateTracker } from "state/abstract-state";
import { StateFactory } from "state/state-factory";
import { AbstractSelectedState } from "./abstract-selected";

/**
 * The state when an intermediate point is selected and the user is dragging it.
 */
export class IntermediatePointSelectedState extends AbstractSelectedState {
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

    protected override aboutToExit(): void {
        this.intermediatePoint.makeDeslected();
        this.intermediatePoint.makeHidden();
        for (const intermediatePoint of this.intermediatePoint.endPoint.getIntermediatePoints()) {
            intermediatePoint.makeHidden();
        }
    }

    override onIntermediatePointClick(intermediatePoint: IntermediatePoint): void {
        if (intermediatePoint === this.intermediatePoint) {
            this.dragging = true;
        } else {
            this.intermediatePoint.makeDeslected();
            this.changeState(this.factory.intermediatePointSelected(intermediatePoint));
        }
    }
}