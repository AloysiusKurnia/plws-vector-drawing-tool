import { EndPoint } from "controllers/components/end-point";
import { IntermediatePoint } from "controllers/components/intermediate-point";
import { StateTracker } from "state/abstract-state";
import { StateFactory } from "state/state-factory";
import { Pointlike } from "util/utility-types";
import { AbstractSelectedState } from "./abstract-selected";

/**
 * The state when an end point is selected and the user is dragging it.
 */
export class EndPointSelectedState extends AbstractSelectedState {
    private initialLocations = new Map<IntermediatePoint, Pointlike>();
    private initialEndPointLocation: Pointlike;
    constructor(
        tracker: StateTracker,
        factory: StateFactory,
        private endPoint: EndPoint,
        startAsDragging = true
    ) {
        super(tracker, factory);
        this.dragging = startAsDragging;
        endPoint.makeSelected();
        this.initialEndPointLocation = { x: endPoint.x, y: endPoint.y };
        for (const intermediatePoint of endPoint.getIntermediatePoints()) {
            intermediatePoint.updateView();
            intermediatePoint.makeShown();
            this.initialLocations.set(
                intermediatePoint,
                { x: intermediatePoint.x, y: intermediatePoint.y }
            );
        }
    }

    override onMouseMove(x: number, y: number): void {
        if (this.dragging) {
            this.endPoint.copyFrom({ x, y });
            this.endPoint.updateView();
            const dx = x - this.initialEndPointLocation.x;
            const dy = y - this.initialEndPointLocation.y;
            for (const [intermediatePoint, initialLocation] of this.initialLocations) {
                intermediatePoint.copyFrom({
                    x: initialLocation.x + dx,
                    y: initialLocation.y + dy
                });
                intermediatePoint.updateView();
                intermediatePoint.owner.updateView();
            }
        }
    }

    protected override aboutToExit(): void {
        this.endPoint.makeDeslected();
        for (const intermediatePoint of this.endPoint.getIntermediatePoints()) {
            intermediatePoint.makeHidden();
        }
    }

    override onEndPointClick(point: EndPoint): void {
        if (point !== this.endPoint) {
            this.aboutToExit();
            this.changeState(this.factory.endPointSelected(point));
        } else {
            this.dragging = true;
        }
    }

    override onIntermediatePointClick(point: IntermediatePoint): void {
        this.endPoint.makeDeslected();
        this.changeState(this.factory.intermediatePointSelected(point));
    }
}