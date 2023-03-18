import { COLOR, ID } from "constants/settings";
import { UseWrapper } from "util/svg-wrapper";

export class EndPointView extends UseWrapper {
    constructor() {
        super(`#${ID.endPoint}`);
    }

    graphicsToHovered() {
        this.style.fill = COLOR.endPointHover;
    }

    graphicsToDefault() {
        this.style.fill = COLOR.endPoint;
    }

    graphicsToSelected() {
        this.style.fill = COLOR.endPointSelected;
    }
}