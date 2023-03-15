import { StateTracker } from "./state";
import { IdleState } from "./states/idle";

export class StateFactory {
    constructor(private tracker: StateTracker) { }

    idle() {
        return new IdleState(this.tracker);
    }
}