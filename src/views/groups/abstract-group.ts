import { GroupWrapper } from "util/svg-wrapper";

/**
 * An abstract group that contains some drawing elements.
 */
export abstract class AbstractGroup extends GroupWrapper {
    /**
     * Rescales the group.
     * @param zoomFactor The factor by which to rescale the group.
     */
    abstract rescale(zoomFactor: number): void;
}