import { Procedure } from "util/utility-types";

export class AnimationFrameController {
    private procedureMap = new Map<Procedure, Procedure>();
    public register(procedure: Procedure): void {
        const loop = () => {
            if (!this.procedureMap.has(procedure)) { return; }

            procedure();
            requestAnimationFrame(loop);
        };
        this.procedureMap.set(procedure, loop);
        requestAnimationFrame(loop);
    }

    public unregister(procedure: Procedure): void {
        this.procedureMap.delete(procedure);
    }
}