import { EndPoint } from "controllers/components/end-point";
import { ElementFactory } from "controllers/element-factory";
import { SVGCanvas } from "views/canvas";

import { AppState, StateTracker } from "./abstract-state";
import { DrawInitState } from "./states/draw-init";
import { DrawingState } from "./states/drawing";
import { EndPointSelectedState } from "./states/end-point-selected";
import { IdleState } from "./states/idle";

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

    endPointSelected(endPoint: EndPoint): AppState {
        return new EndPointSelectedState(this.tracker, this, endPoint);
    }
}