import { EndPoint } from "controllers/components/end-point";
import { AppState } from "state/abstract-state";

/**
 * The default state when nothing is selected.
 */
export class IdleState extends AppState {
    override onSpace(): void {
        this.changeState(this.factory.drawInit());
    }

    override onEndPointClick(point: EndPoint): void {
        this.changeState(this.factory.endPointSelected(point));
    }
}