import { EndPoint } from "controllers/components/end-point";
import { AppState, StateTracker } from "state/abstract-state";
import { StateFactory } from "state/state-factory";

export class EndPointSelectedState extends AppState {
    constructor(tracker: StateTracker, factory: StateFactory, private endPoint: EndPoint) {
        super(tracker, factory);
        endPoint.makeSelected();
        for (const intermediatePoint of endPoint.getIntermediatePoints()) {
            intermediatePoint.updateView();
            intermediatePoint.makeShown();
        }
    }

    private aboutToExit(): void {
        this.endPoint.makeDeslected();
        for (const intermediatePoint of this.endPoint.getIntermediatePoints()) {
            intermediatePoint.makeHidden();
        }
    }

    override onEscape(): void {
        this.aboutToExit();
        this.changeState(this.factory.idle());
    }

    override onEndPointClick(point: EndPoint): void {
        if (point !== this.endPoint) {
            this.aboutToExit();
            this.changeState(this.factory.endPointSelected(point));
        }
    }

}