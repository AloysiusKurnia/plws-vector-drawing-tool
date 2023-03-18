import { COLOR, ID } from "constants/settings";
import { UseWrapper } from "util/svg-wrapper";

export class EndPointView extends UseWrapper {
    constructor() {
        super(`#${ID.controlPoint}`);
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