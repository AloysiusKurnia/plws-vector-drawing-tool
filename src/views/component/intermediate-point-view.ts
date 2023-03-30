import { COLOR, ID } from "constants/settings";
import { GroupWrapper, LineWrapper, UseWrapper } from "util/svg-wrapper";
import { Pointlike } from "util/utility-types";
import { IntermediatePointGroup } from "views/groups/intermediate-point-group";
import { ChangeableGraphics } from "./changable-graphics";

/**
 * The view of an intermediate point.
 */
export class IntermediatePointView extends GroupWrapper
    implements ChangeableGraphics {
    private line: LineWrapper;
    private point: UseWrapper;
    /**
     * Creates an intermediate point view.
     * @param group The group to which this view belongs.
     */
    constructor(group: IntermediatePointGroup) {
        super();
        group.add(this);
        this.line = new LineWrapper();
        this.point = new UseWrapper(`#${ID.intermediatePoint}`);
        this.line.style.stroke = COLOR.intermediateLine;
        this.line.makeIntangible();
        this.add(this.line);
        this.add(this.point);

        this.makeHidden();
    }

    override addEvent<T extends keyof SVGElementEventMap>(
        eventName: T, listener:
            (ev: SVGElementEventMap[T]) => void
    ): void {
        this.point.addEvent(eventName, listener);
    }

    /**
     * Move the intermediate point to a new position.
     * @param pos The new position.
     */
    movePointTo(pos: Pointlike) {
        this.point.setPosition(pos.x, pos.y);
        this.line.point1 = pos;
        this.line.update();
    }

    /**
     * Move the origin of the line to a new position.
     * @param pos The new position.
     */
    moveOriginTo(pos: Pointlike) {
        this.line.point0 = pos;
        this.line.update();
    }

    /** @implements {ChangeableGraphics.graphicsToHovered} */
    graphicsToHovered() {
        this.point.style.fill = COLOR.intermediatePointHover;
        this.point.style.stroke = COLOR.lightBlack;
    }

    /** @implements {ChangeableGraphics.graphicsToDefault} */
    graphicsToDefault() {
        this.point.style.fill = COLOR.intermediatePoint;
        this.point.style.stroke = COLOR.black;
    }

    /** @implements {ChangeableGraphics.graphicsToSelected} */
    graphicsToSelected() {
        this.point.style.fill = COLOR.intermediatePointSelected;
        this.point.style.stroke = COLOR.lightBlack;
    }

    /**
     * Change the graphics to when the intermediate point's couple is selected.
     */
    graphicsToCoupled() {
        this.point.style.fill = COLOR.intermediatePointCouple;
        this.point.style.stroke = COLOR.lightBlack;
    }
}