import { COLOR, DIMENSION, ID } from "constants/settings";
import { CircleWrapper, DefsWrapper, GroupWrapper } from "util/svg-wrapper";

export class EndPointGroup extends GroupWrapper {
    private defintion = new DefsWrapper();

    constructor() {
        super();

        const template = new CircleWrapper();
        template.setRadius(DIMENSION.endPointRadius);
        this.defintion.add(template, ID.endPoint);
        this.defintion.appendTo(this);

        template.setCenter(0, 0);
    }
}