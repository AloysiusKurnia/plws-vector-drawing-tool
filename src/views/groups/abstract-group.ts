import { GroupWrapper } from "util/svg-wrapper";

export abstract class AbstractGroup extends GroupWrapper {
    constructor() {
        super();
    }

    protected defaultScaleFactor = 1;

    setDefaultScaleFactor(factor: number) {
        this.defaultScaleFactor = factor;
    }

    abstract rescale(zoomFactor: number): void;
}