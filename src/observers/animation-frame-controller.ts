import { Procedure } from "util/utility-types";

/** 
 * A controller that manages the animation frame loop.
 */
export class AnimationFrameController {
    private procedureMap = new Map<Procedure, Procedure>();
    /**
     * Registers a procedure to be called on each animation frame.
     * @param procedure The procedure to register.
     */
    public register(procedure: Procedure): void {
        const loop = () => {
            if (!this.procedureMap.has(procedure)) { return; }

            procedure();
            requestAnimationFrame(loop);
        };
        this.procedureMap.set(procedure, loop);
        requestAnimationFrame(loop);
    }

    /**
     * Unregisters a procedure from the animation frame loop.
     * @param procedure The procedure to unregister.
     */
    public unregister(procedure: Procedure): void {
        this.procedureMap.delete(procedure);
    }
}