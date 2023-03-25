import { EndPoint } from "controllers/components/end-point";
import { IntermediatePoint } from "controllers/components/intermediate-point";
import { ElementFactory } from "controllers/element-factory";
import { SVGCanvas } from "views/canvas";

import { AppState, StateTracker } from "./abstract-state";
import { DrawInitState } from "./states/draw-init";
import { DrawingState } from "./states/drawing";
import { EndPointSelectedState } from "./states/end-point-selected";
import { IdleState } from "./states/idle";
import { IntermediatePointSelectedState } from "./states/intermediate-point-selected";

export class StateFactory {
    constructor(
        private tracker: StateTracker,
        private svgCanvas: SVGCanvas,
        private elementFactory: ElementFactory,
    ) { }

    idle(): AppState {
        return new IdleState(this.tracker, this);
    }

    drawInit(): AppState {
        return new DrawInitState(this.tracker, this, this.svgCanvas);
    }

    drawing(
        pointX: number, pointY: number,
        firstPoint: EndPoint | null = null,
    ): AppState {
        return new DrawingState(this.tracker, this, this.elementFactory, pointX, pointY, firstPoint);
    }

    endPointSelected(endPoint: EndPoint, startAsDragging = true): AppState {
        return new EndPointSelectedState(this.tracker, this, endPoint, startAsDragging);
    }

    intermediatePointSelected(intermediatePoint: IntermediatePoint): AppState {
        return new IntermediatePointSelectedState(
            this.tracker,
            this,
            intermediatePoint);
    }
}