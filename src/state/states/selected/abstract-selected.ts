import { EndPoint } from "controllers/components/end-point";
import { IntermediatePoint } from "controllers/components/intermediate-point";
import { AppState } from "state/abstract-state";

/**
 * The state when something is selected and the user is dragging it.
 */
export abstract class AbstractSelectedState extends AppState {
    /** Whether the user is dragging the selected item. */
    protected dragging = true;

    /** Performs the necessary actions before exiting the state. */
    protected abstract aboutToExit(): void;

    override onMouseUp(): void {
        this.dragging = false;
    }

    override onEscape(): void {
        this.aboutToExit();
        this.changeState(this.factory.idle());
    }

    override onEmptyClick(): void {
        this.aboutToExit();
        this.changeState(this.factory.idle());
    }

    override onEndPointClick(point: EndPoint): void {
        this.aboutToExit();
        this.changeState(this.factory.endPointSelected(point));
    }

    override onIntermediatePointClick(point: IntermediatePoint): void {
        this.aboutToExit();
        this.changeState(this.factory.intermediatePointSelected(point));
    }
}