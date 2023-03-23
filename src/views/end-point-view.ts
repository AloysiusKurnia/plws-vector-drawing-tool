import { COLOR, ID } from "constants/settings";
import { UseWrapper } from "util/svg-wrapper";
import { EndPointGroup } from "./groups/end-point-group";

export class EndPointView extends UseWrapper {
    constructor(group: EndPointGroup) {
        super(`#${ID.endPoint}`);
        group.add(this);
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