import { COLOR, ID } from "constants/settings";
import { UseWrapper } from "util/svg-wrapper";
import { EndPointGroup } from "../groups/end-point-group";

/**
 * The view of an end point.
 */
// TODO: Abstract graphicsToHovered, graphicsToDefault, and graphicsToSelected
// into an interface.
export class EndPointView extends UseWrapper {
    /**
     * Creates an end point view.
     * @param group The group to which this view belongs.
     */
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