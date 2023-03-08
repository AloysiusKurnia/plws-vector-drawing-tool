import { EventManager } from "observer/event-manager";

type MaybeAppState = AppState | undefined;

export abstract class AppState {
    protected readonly eventManager: EventManager;
    onControlPointClick(point: ControlPoint): MaybeAppState { return undefined; }
    onSegmentClick(segment: CurveSegment): MaybeAppState { return undefined; }
    onMouseMove(x: number, y: number): MaybeAppState { return undefined; }
    onEscape(): MaybeAppState { return undefined; }
    onSpace(): MaybeAppState { return undefined; }
    onLetterB(): MaybeAppState { return undefined; }
    onLetterR(): MaybeAppState { return undefined; }
    onReleaseR(): MaybeAppState { return undefined; }
    onLetterF(): MaybeAppState { return undefined; }
    onNumber1(): MaybeAppState { return undefined; }
    onNumber2(): MaybeAppState { return undefined; }
    onNumber3(): MaybeAppState { return undefined; }
    onNumber4(): MaybeAppState { return undefined; }
}

export class StateTracker {
    private currentState: AppState;
    constructor(eventManager: EventManager) {
        this.currentState = new IdleState(eventManager);
    }

    private changeStateIfNecessary(newState: MaybeAppState) {
        if (newState) {
            this.currentState = newState;
        }
    }

    onControlPointClick(point: ControlPoint) {
        this.changeStateIfNecessary(this.currentState.onControlPointClick(point));
    }

    onSegmentClick(segment: CurveSegment) {
        this.changeStateIfNecessary(this.currentState.onSegmentClick(segment));
    }

    onMouseMove(x: number, y: number) {
        this.changeStateIfNecessary(this.currentState.onMouseMove(x, y));
    }

    onEscape() {
        this.changeStateIfNecessary(this.currentState.onEscape());
    }

    onSpace() {
        this.changeStateIfNecessary(this.currentState.onSpace());
    }

    onLetterB() {
        this.changeStateIfNecessary(this.currentState.onLetterB());
    }

    onLetterR() {
        this.changeStateIfNecessary(this.currentState.onLetterR());
    }

    onReleaseR() {
        this.changeStateIfNecessary(this.currentState.onReleaseR());
    }

    onLetterF() {
        this.changeStateIfNecessary(this.currentState.onLetterF());
    }

    onNumber1() {
        this.changeStateIfNecessary(this.currentState.onNumber1());
    }

    onNumber2() {
        this.changeStateIfNecessary(this.currentState.onNumber2());
    }

    onNumber3() {
        this.changeStateIfNecessary(this.currentState.onNumber3());
    }

    onNumber4() {
        this.changeStateIfNecessary(this.currentState.onNumber4());
    }
}