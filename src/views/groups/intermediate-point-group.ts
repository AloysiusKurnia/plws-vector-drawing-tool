import { DIMENSION, ID } from "constants/settings";
import { CircleWrapper, DefsWrapper } from "util/svg-wrapper";
import { AbstractGroup } from "./abstract-group";

export class IntermediatePointGroup extends AbstractGroup {
    private template: CircleWrapper;

    constructor() {
        super();
        const defintion = new DefsWrapper();
        this.template = new CircleWrapper();
        this.template.setRadius(DIMENSION.intermediatePointRadius);
        defintion.add(this.template, ID.intermediatePoint);
        defintion.appendTo(this);
        
        this.template.setCenter(0, 0);
        this.template.style.strokeWidth = `${DIMENSION.pointStrokeWidth}`;
        this.style.strokeWidth = `${DIMENSION.intermediateLineWidth}`;
    }

    rescale(zoomFactor: number): void {
        const factor = zoomFactor / this.defaultScaleFactor;
        this.template.setRadius(DIMENSION.intermediatePointRadius * factor);
        this.template.style.strokeWidth = `${DIMENSION.pointStrokeWidth * factor}`;
        
        this.style.strokeWidth = `${DIMENSION.intermediateLineWidth * factor}`;
    }
}