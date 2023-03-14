import { Procedure } from "util/utility-types";

export class AnimationFrameController {
    private procedureMap: Map<Procedure, number> = new Map();

    public register(procedure: Procedure): void {
        const id = requestAnimationFrame(() => {
            procedure();
            this.procedureMap.delete(procedure);
        });
        this.procedureMap.set(procedure, id);
    }

    public unregister(procedure: Procedure): void {
        const id = this.procedureMap.get(procedure);
        if (id) {
            cancelAnimationFrame(id);
            this.procedureMap.delete(procedure);
        }
    }
}