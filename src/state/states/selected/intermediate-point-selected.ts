import { IntermediatePoint } from "controllers/components/intermediate-point";
import { StateTracker } from "state/abstract-state";
import { StateFactory } from "state/state-factory";
import { TextPopUp } from "views/gui/text-popup";
import { AbstractSelectedState } from "./abstract-selected";

/**
 * The state when an intermediate point is selected and the user is dragging it.
 */
export class IntermediatePointSelectedState extends AbstractSelectedState {
    private coupleDistance = 0;
    constructor(
        tracker: StateTracker,
        factory: StateFactory,
        private intermediatePoint: IntermediatePoint,
        private settings: {
            dragMode: 'linear' | 'locked' | 'proportional';
        },
        private textPopUp: TextPopUp
    ) {
        super(tracker, factory);
        intermediatePoint.makeSelected();
        if (intermediatePoint.couple) {
            intermediatePoint.couple.makeSelected(true);
            this.coupleDistance = intermediatePoint.couple
                .getDistanceToEndpoint();
        }
    }

    override onMouseMove(x: number, y: number): void {
        if (this.dragging) {
            this.intermediatePoint.copyFrom({ x, y });
            this.intermediatePoint.updateView();
            this.intermediatePoint.owner.updateView();
            if (this.intermediatePoint.couple) {
                const angle = this.intermediatePoint.getAngleToEndpoint() +
                    Math.PI;
                const coupleDx = this.coupleDistance * Math.cos(angle);
                const coupleDy = this.coupleDistance * Math.sin(angle);
                this.intermediatePoint.couple.copyFrom({
                    x: this.intermediatePoint.endPoint.x + coupleDx,
                    y: this.intermediatePoint.endPoint.y + coupleDy,
                });
                this.intermediatePoint.couple.updateView();
                this.intermediatePoint.couple.owner.updateView();
            }
        }
    }

    protected override aboutToExit(): void {
        this.intermediatePoint.makeDeslected();
        if (this.intermediatePoint.couple) {
            this.intermediatePoint.couple.makeDeslected();
        }
        for (const intermediatePoint of this.intermediatePoint.endPoint.getIntermediatePoints()) {
            intermediatePoint.makeHidden();
        }
    }

    override onIntermediatePointClick(intermediatePoint: IntermediatePoint): void {
        if (intermediatePoint === this.intermediatePoint) {
            this.dragging = true;
        } else {
            this.intermediatePoint.makeDeslected();
            this.intermediatePoint.couple?.makeDeslected();
            this.changeState(this.factory.intermediatePointSelected(intermediatePoint));
        }
    }

    override onNumber1(): void {
        this.settings.dragMode = 'linear';
        this.textPopUp.displayText('Linear drag mode');
    }

    override onNumber2(): void {
        this.settings.dragMode = 'locked';
        this.textPopUp.displayText('Locked drag mode');
    }

    override onNumber3(): void {
        this.settings.dragMode = 'proportional';
        this.textPopUp.displayText('Proportional drag mode');
    }
}