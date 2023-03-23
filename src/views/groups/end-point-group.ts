import { DIMENSION, ID } from "constants/settings";
import { CircleWrapper, DefsWrapper } from "util/svg-wrapper";
import { AbstractGroup } from "./abstract-group";

export class EndPointGroup extends AbstractGroup {
    private template: CircleWrapper;

    constructor() {
        super();
        const defintion = new DefsWrapper();
        this.template = new CircleWrapper();
        this.template.setRadius(DIMENSION.endPointRadius);
        defintion.add(this.template, ID.endPoint);
        defintion.appendTo(this);
        
        this.template.setCenter(0, 0);
        this.template.style.strokeWidth = `${DIMENSION.endPointStrokeWidth}`;
    }

    rescale(zoomFactor: number): void {
        const factor = zoomFactor / this.defaultScaleFactor;
        this.template.setRadius(DIMENSION.endPointRadius * factor);
        this.template.style.strokeWidth = `${DIMENSION.endPointStrokeWidth * factor}`;
        this.template
    }
}