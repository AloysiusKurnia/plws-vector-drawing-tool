import { EndPoint } from "controllers/components/end-point";
import { IntermediatePoint } from "controllers/components/intermediate-point";
import { SplineSegment } from "controllers/components/spline-segment";
import { StateFactory } from "./state-factory";

/**
 * An abstract class that represents the current state of the application.
 */
export abstract class AppState {
    /**
     * Builds a new state.
     * @param stateTracker The tracker that tracks the current state.
     * @param factory The factory that builds new states.
     */
    constructor(
        protected readonly stateTracker: StateTracker,
        protected readonly factory: StateFactory
    ) { }

    /**
     * Changes the current state of the application.
     * @param state The new state.
     */
    protected changeState(state: AppState) {
        this.stateTracker.setCurrentState(state);
    }

    // These are to be overridden by the child classes.
    // By default, they do nothing.
    
    /* eslint-disable @typescript-eslint/no-unused-vars */
    /* eslint-disable @typescript-eslint/no-empty-function */

    /** 
     * Called when the user clicks on an end point.
     * @param point The point that was clicked.
     */
    onEndPointClick(point: EndPoint) { }
    /**
     * Called when the user clicks on a segment.
     * @param segment The segment that was clicked.
     */
    onSegmentClick(segment: SplineSegment) { }
    /**
     * Called when the user clicks on an intermediate point.
     * @param point The point that was clicked.
     */
    onIntermediatePointClick(point: IntermediatePoint) { }

    /**
     * Called when the cursor enters an end point UI.
     * @param point The point that was entered.
     */
    onEndPointEnter(point: EndPoint) { }
    /**
     * Called when the cursor enters a segment UI.
     * @param segment The segment that was entered.
     */
    onSegmentEnter(segment: SplineSegment) { }
    /**
     * Called when the cursor enters an intermediate point UI.
     * @param point The point that was entered.
     */
    onIntermediatePointEnter(point: IntermediatePoint) { }

    /**
     * Called when the cursor leaves an end point UI.
     * @param point The point that was left.
     */
    onEndPointLeave(point: EndPoint) { }
    /**
     * Called when the cursor leaves a segment UI.
     * @param segment The segment that was left.
     */
    onSegmentLeave(segment: SplineSegment) { }
    /**
     * Called when the cursor leaves an intermediate point UI.
     * @param point The point that was left.
     */
    onIntermediatePointLeave(point: IntermediatePoint) { }
    
    /**
     * Called when the user clicks on the empty space.
     * @param x The x coordinate of the click.
     * @param y The y coordinate of the click.
     */
    onEmptyClick(x: number, y: number) { }
    /**
     * Called when the user moves the cursor.
     * @param x The x coordinate of the cursor.
     * @param y The y coordinate of the cursor.
     */
    onMouseMove(x: number, y: number) { }
    /**
     * Called when the user releases the mouse button.
     * @param x The x coordinate of the cursor.
     * @param y The y coordinate of the cursor.
     */
    onMouseUp(x: number, y: number) { }

    /** Called when the user presses the escape key. */
    onEscape() { }
    /** Called when the user presses the space bar. */
    onSpace() { }
    /** Called when the user presses the letter B. */
    onLetterB() { }
    /** Called when the user presses the letter R. */
    onLetterR() { }
    /** Called when the user released the letter R. */
    onReleaseR() { }
    /** Called when the user presses the letter F. */
    onLetterF() { }
    /** Called when the user presses the number key 1. */
    onNumber1() { }
    /** Called when the user presses the number key 2. */
    onNumber2() { }
    /** Called when the user presses the number key 3. */
    onNumber3() { }
    /** Called when the user presses the number key 4. */
    onNumber4() { }

    /* eslint-enable @typescript-eslint/no-unused-vars */
    /* eslint-enable @typescript-eslint/no-empty-function */
}

export interface StateTracker {
    getCurrentState(): AppState;
    setCurrentState(state: AppState): void;
}