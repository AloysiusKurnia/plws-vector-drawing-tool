import { Canvas } from "canvas";
import { ControlPoint } from "element/elements/control-point";
import { SplineSegment } from "element/elements/spline-segment";
import { AppState, StateTracker } from "state/state";
import { ElementWrapper, SVGWrapper } from "util/svg-wrapper";
import { ZoomManager } from "./zoom";

export class ControlManager {
    private stateTracker: StateTracker;
    private zoomManager: ZoomManager;
    private stateKeyMapping: Record<string, (state: AppState) => void>;
    private zoomKeyMapping: Record<string, () => void>;
    private amplification = 0;
    private miscPressedKeys: Record<string, boolean> = {};
    private toBeDoneOnEveryFrame: Record<number, () => void> = {};

    constructor(
        stateTracker: StateTracker,
        zoomManager: ZoomManager,
        canvas: SVGWrapper
    ) {
        this.stateTracker = stateTracker;
        this.zoomManager = zoomManager;

        this.stateKeyMapping = {
            "Escape": state => state.onEscape(),
            " ": state => state.onSpace(),
            "b": state => state.onLetterB(),
            "r": state => state.onLetterR(),
            "f": state => state.onLetterF(),
            "1": state => state.onNumber1(),
            "2": state => state.onNumber2(),
            "3": state => state.onNumber3(),
            "4": state => state.onNumber4()
        };

        this.zoomKeyMapping = {
            "a": () => this.zoomManager.pan(-10, 0),
            "d": () => this.zoomManager.pan(10, 0),
            "w": () => this.zoomManager.pan(0, -10),
            "s": () => this.zoomManager.pan(0, 10),
            "q": () => this.zoomManager.zoomIn(),
            "e": () => this.zoomManager.zoomOut(),
        };

        document.addEventListener("keydown", (event) => {
            const key = event.key;
            if (key in this.stateKeyMapping) {
                if (event.repeat) { return; }

                this.stateKeyMapping[key](this.getCurrentState());

            } else if (key in this.zoomKeyMapping) {
                this.zoomKeyMapping[key]();
                zoomManager.applyViewBoxTo(canvas);
                this.miscPressedKeys[key] = true;
            }
        });

        document.addEventListener("keyup", (event) => {
            const key = event.key;
            if (key === "r") {
                this.getCurrentState().onReleaseR();
            }
        });

        requestAnimationFrame(() => {
            for (const key in this.toBeDoneOnEveryFrame) {
                this.toBeDoneOnEveryFrame[key]();
            }
        });
    }

    registerOnEveryFrame(callback: () => void): number {
        let token = 0;
        while (token in this.toBeDoneOnEveryFrame) {
            token++;
        }
        this.toBeDoneOnEveryFrame[token] = callback;
        return token;
    }

    unregisterOnEveryFrame(token: number) {
        delete this.toBeDoneOnEveryFrame[token];
    }


    registerControlPointClick(point: ControlPoint) {
        point.getElement().addEvent("mousedown",
            () => this.getCurrentState().onControlPointClick(point)
        );
    }

    registerSegmentClick(segment: SplineSegment) {
        segment.getElement().addEvent("mousedown",
            () => this.getCurrentState().onSegmentClick(segment)
        );
    }

    registerCanvasClick(canvas: Canvas) {
        canvas.addEvent("mousedown",
            (event: MouseEvent) => {
                const x = event.offsetX;
                const y = event.offsetY;
                this.getCurrentState().onEmptyClick(x, y);
            }
        );
    }

    private getCurrentState(): AppState {
        return this.stateTracker.getCurrentState();
    }
}