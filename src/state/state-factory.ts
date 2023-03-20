import { App } from "app";
import { EndPoint } from "models/components/end-point";
import { ElementFactory } from "models/element-factory";
import { Canvas } from "views/canvas";
import { AppState, StateTracker } from "./state";
import { DrawInitState } from "./states/draw-init";
import { DrawingState } from "./states/drawing";
import { IdleState } from "./states/idle";

export class StateFactory {
    constructor(
        private tracker: StateTracker,
        private canvas: Canvas,
        private elementFactory: ElementFactory,
    ) { }

    idle(): AppState {
        return new IdleState(this.tracker, this);
    }

    drawInit(): AppState {
        return new DrawInitState(this.tracker, this, this.canvas);
    }

    drawing(
        pointX: number, pointY: number,
        firstPoint: EndPoint | null = null,
    ): AppState {
        return new DrawingState(this.tracker, this, this.elementFactory, pointX, pointY, firstPoint);
    }
}