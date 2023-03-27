import { DIMENSION, ID } from "constants/settings";
import { CircleWrapper, DefsWrapper } from "util/svg-wrapper";
import { AbstractGroup } from "./abstract-group";

/** A group that contains end point elements. */
export class EndPointGroup extends AbstractGroup {
    private template: CircleWrapper;

    /** Creates an end point group. */
    constructor() {
        super();
        const defintion = new DefsWrapper();
        this.template = new CircleWrapper();
        this.template.setRadius(DIMENSION.endPointRadius);
        defintion.add(this.template, ID.endPoint);
        defintion.appendTo(this);

        this.template.setCenter(0, 0);
        this.template.style.strokeWidth = `${DIMENSION.pointStrokeWidth}`;
    }

    override rescale(zoomFactor: number): void {
        this.template.setRadius(DIMENSION.endPointRadius * zoomFactor);
        this.template
            .style
            .strokeWidth = `${DIMENSION.pointStrokeWidth * zoomFactor}`;
    }
}