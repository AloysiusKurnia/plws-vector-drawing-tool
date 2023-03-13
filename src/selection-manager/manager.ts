import { Selectable } from "./selectable";

export class SelectionManager {
    private selected = new Set<Selectable>();

    select(selectable: Selectable) {
        const selectedSet = this.selected;
        if (!selectedSet.has(selectable)) {
            selectedSet.add(selectable);
            selectable.updateGraphicsToHovered();
        }
    }

    deselect(selectable: Selectable) {
        const selectedSet = this.selected;
        if (selectedSet.has(selectable)) {
            selectedSet.add(selectable);
            selectable.updateGraphicsToUnhovered();
        }
    }
}