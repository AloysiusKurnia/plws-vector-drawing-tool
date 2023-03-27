import { GroupWrapper } from "util/svg-wrapper";

/**
 * An abstract group that contains some drawing elements.
 */
export abstract class AbstractGroup extends GroupWrapper {
    // TODO: See the todo at zoom-controller.ts. This is pending removal.
    protected defaultScaleFactor = 1;
    setDefaultScaleFactor(factor: number) {
        this.defaultScaleFactor = factor;
    }

    /**
     * Rescales the group.
     * @param zoomFactor The factor by which to rescale the group.
     */
    abstract rescale(zoomFactor: number): void;
}