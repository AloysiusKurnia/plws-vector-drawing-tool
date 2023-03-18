import { COLOR, ID } from "constants/settings";
import { UseWrapper } from "util/svg-wrapper";

export class ControlPointView extends UseWrapper {
    constructor(x: number, y: number) {
        super(`#${ID.controlPoint}`);
        this.setPosition(x, y);
    }

    graphicsToHovered() {
        this.style.fill = COLOR.pointHover;
    }

    graphicsToDefault() {
        this.style.fill = COLOR.point;
    }

    graphicsToSelected() {
        this.style.fill = COLOR.pointSelected;
    }
}