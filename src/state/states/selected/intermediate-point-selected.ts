import { IntermediatePoint } from "controllers/components/intermediate-point";
import { StateTracker } from "state/abstract-state";
import { StateFactory } from "state/state-factory";
import { TextPopUp } from "views/gui/text-popup";
import { AbstractSelectedState } from "./abstract-selected";

/**
 * The state when an intermediate point is selected and the user is dragging it.
 */
export class IntermediatePointSelectedState extends AbstractSelectedState {
    private initialDistance = 0;
    private coupleInitialDistance = 0;
    private initialAngle = 0;
    private couple: IntermediatePoint | null = null;
    constructor(
        tracker: StateTracker,
        factory: StateFactory,
        private point: IntermediatePoint,
        private settings: {
            locked: boolean;
            proportional: boolean;
        },
        private textPopUp: TextPopUp
    ) {
        super(tracker, factory);
        point.makeSelected();
        this.initialDistance = point.getDistanceToEndpoint();
        this.couple = point.couple;
        this.initialAngle = point.getAbsoluteAngle();
        if (this.couple) {
            this.couple.makeSelected(true);
            this.coupleInitialDistance = this.couple.getDistanceToEndpoint();
        }
    }

    override onMouseUp(): void {
        this.initialDistance = this.point.getDistanceToEndpoint();
        this.coupleInitialDistance = this.couple?.getDistanceToEndpoint() ?? 0;
        this.initialAngle = this.point.getAbsoluteAngle();
        this.dragging = false;
    }

    override onMouseMove(x: number, y: number): void {
        if (this.settings.locked) {
            const cursorDx = this.point.endPoint.x - x;
            const cursorDy = this.point.endPoint.y - y;
            const cursorDistance = Math.hypot(cursorDx, cursorDy);
            const angleDiff = Math.atan2(cursorDy, cursorDx) - this.initialAngle;
            const projectedDistance = -cursorDistance * Math.cos(angleDiff);
            x = this.point.endPoint.x +
                projectedDistance * Math.cos(this.initialAngle);
            y = this.point.endPoint.y +
                projectedDistance * Math.sin(this.initialAngle);
        }
        if (this.dragging) {
            this.point.copyFrom({ x, y });
            this.point.updateView();
            this.point.owner.updateView();
            if (this.couple) {
                const coupleDistance = this.settings.proportional ? (
                    this.coupleInitialDistance / this.initialDistance
                    * this.point.getDistanceToEndpoint()
                ) : this.coupleInitialDistance;
                const angle = this.point.getAbsoluteAngle() +
                    Math.PI;
                const coupleDx = coupleDistance * Math.cos(angle);
                const coupleDy = coupleDistance * Math.sin(angle);
                this.couple.copyFrom({
                    x: this.point.endPoint.x + coupleDx,
                    y: this.point.endPoint.y + coupleDy,
                });
                this.couple.updateView();
                this.couple.owner.updateView();
            }
        }
    }

    protected override aboutToExit(): void {
        this.point.makeDeslected();
        if (this.couple) {
            this.couple.makeDeslected();
        }
        for (const intermediatePoint of this.point.endPoint.getIntermediatePoints()) {
            intermediatePoint.makeHidden();
        }
    }

    override onIntermediatePointClick(intermediatePoint: IntermediatePoint): void {
        if (intermediatePoint === this.point) {
            this.dragging = true;
        } else {
            this.point.makeDeslected();
            this.couple?.makeDeslected();
            this.changeState(this.factory.intermediatePointSelected(intermediatePoint));
        }
    }

    override onNumber1(): void {
        this.settings.locked = false;
        this.settings.proportional = false;
        this.textPopUp.displayText('Drag mode: free');
    }

    override onNumber2(): void {
        this.settings.locked = true;
        this.settings.proportional = false;
        this.textPopUp.displayText('Drag mode: locked');
    }

    override onNumber3(): void {
        this.settings.locked = false;
        this.settings.proportional = true;
        this.textPopUp.displayText('Drag mode: proportional');
    }

    override onNumber4(): void {
        this.settings.locked = true;
        this.settings.proportional = true;
        this.textPopUp.displayText('Drag mode: locked-proportional');
    }
}