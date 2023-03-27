import { COLOR, ID } from "constants/settings";
import { UseWrapper } from "util/svg-wrapper";
import { EndPointGroup } from "../groups/end-point-group";
import { ChangeableGraphics } from "./changable-graphics";

/**
 * The view of an end point.
 */
export class EndPointView extends UseWrapper implements ChangeableGraphics {
    /**
     * Creates an end point view.
     * @param group The group to which this view belongs.
     */
    constructor(group: EndPointGroup) {
        super(`#${ID.endPoint}`);
        group.add(this);
    }

    /** @implements {ChangeableGraphics.graphicsToHovered} */
    graphicsToHovered() {
        this.style.fill = COLOR.endPointHover;
    }

    /** @implements {ChangeableGraphics.graphicsToDefault} */
    graphicsToDefault() {
        this.style.fill = COLOR.endPoint;
    }

    /** @implements {ChangeableGraphics.graphicsToSelected} */
    graphicsToSelected() {
        this.style.fill = COLOR.endPointSelected;
    }
}