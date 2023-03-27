import { COLOR, ID } from "constants/settings";
import { GroupWrapper, LineWrapper, UseWrapper } from "util/svg-wrapper";
import { Pointlike } from "util/utility-types";
import { IntermediatePointGroup } from "views/groups/intermediate-point-group";

/**
 * The view of an intermediate point.
 */
export class IntermediatePointView extends GroupWrapper {
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

    override addEvent<T extends keyof SVGElementEventMap>(eventName: T, listener: (ev: SVGElementEventMap[T]) => void): void {
        this.point.addEvent(eventName, listener);
    }

    movePointTo(pos: Pointlike) {
        this.point.setPosition(pos.x, pos.y);
        this.line.point1 = pos;
        this.line.update();
    }

    moveOriginTo(pos: Pointlike) {
        this.line.point0 = pos;
        this.line.update();
    }

    graphicsToHovered() {
        this.point.style.fill = COLOR.intermediatePointHover;
        this.point.style.stroke = COLOR.lightBlack;
    }

    graphicsToDefault() {
        this.point.style.fill = COLOR.intermediatePoint;
        this.point.style.stroke = COLOR.black;
    }

    graphicsToSelected() {
        this.point.style.fill = COLOR.intermediatePointSelected;
        this.point.style.stroke = COLOR.lightBlack;
    }
}