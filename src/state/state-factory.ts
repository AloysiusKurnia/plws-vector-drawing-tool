import { EndPoint } from "controllers/components/end-point";
import { IntermediatePoint } from "controllers/components/intermediate-point";
import { ElementFactory } from "controllers/element-factory";
import { SVGCanvas } from "views/canvas";

import { AppState, StateTracker } from "./abstract-state";
import { DrawInitState } from "./states/draw-init";
import { DrawingState } from "./states/drawing";
import { EndPointSelectedState } from "./states/selected/end-point-selected";
import { IdleState } from "./states/idle";
import { IntermediatePointSelectedState } from "./states/selected/intermediate-point-selected";
import { TextPopUp } from "views/gui/text-popup";

/**
 * Creates new states and initializes them with their required dependencies.
 */
export class StateFactory {
    private settings = {
        intermediatePoint: {
            dragMode: 'linear' as 'linear' | 'locked' | 'proportional'
        }
    };
    constructor(
        private tracker: StateTracker,
        private svgCanvas: SVGCanvas,
        private elementFactory: ElementFactory,
        private textPopUp: TextPopUp,
    ) { }

    /** Creates a new idle state. */
    idle(): AppState {
        return new IdleState(this.tracker, this);
    }

    /** Creates a new draw initialization state. */
    drawInit(): AppState {
        return new DrawInitState(this.tracker, this, this.svgCanvas);
    }

    /**
     * Creates a new drawing state.
     * @param pointX The x coordinate of the mouse pointer.
     * @param pointY The y coordinate of the mouse pointer.
     * @param firstPoint
     * The point clicked on to start drawing. Null if the drawing started from
     * the empty space of the canvas.
     */
    drawing(
        pointX: number, pointY: number,
        firstPoint: EndPoint | null = null,
    ): AppState {
        return new DrawingState(
            this.tracker,
            this,
            this.elementFactory,
            pointX,
            pointY,
            firstPoint);
    }

    /**
     * Creates a new state for when an end point is selected.
     * @param endPoint The selected end point.
     */
    endPointSelected(endPoint: EndPoint): AppState {
        return new EndPointSelectedState(this.tracker, this, endPoint);
    }

    /**
     * Creates a new state for when an intermediate point is selected.
     * @param intermediatePoint The selected intermediate point.
     */
    intermediatePointSelected(intermediatePoint: IntermediatePoint): AppState {
        return new IntermediatePointSelectedState(
            this.tracker,
            this,
            intermediatePoint,
            this.settings.intermediatePoint,
            this.textPopUp);
    }
}