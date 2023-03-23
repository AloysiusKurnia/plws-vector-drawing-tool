import { GroupWrapper } from "util/svg-wrapper";

export abstract class AbstractGroup extends GroupWrapper {
    constructor() {
        super();
    }

    abstract rescale(zoomFactor: number): void;
}