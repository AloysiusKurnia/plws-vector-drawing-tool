import { SVGWrapper } from './util/svg';

export class ZoomAndPan {
    private scalePower = 1;
    private x = 0;
    private y = 0;
    private readonly BASE = 1.2;
    private readonly STANDARD_VIEWBOX_WIDTH = 300;
    private isPanning = false;
    private spaceIsDown = false;
    constructor(
        private element: SVGWrapper<SVGSVGElement>,
        private toolDisabler: () => void,
        private toolEnabler: () => void,
    ) {
        this.enable();
        this.setElementViewBox();
    }

    disable() {
        this.element.removeOn('wheel', this.wheel);
        document.removeEventListener('keydown', this.keyDown);
    }

    enable() {
        this.element.on('wheel', this.wheel);
        document.addEventListener('keydown', this.keyDown);
    }

    private wheel = (e: WheelEvent) => {
        e.preventDefault();
        this.zoom(e.deltaY > 0 ? 1 : -1);
    };

    private keyDown = (e: KeyboardEvent) => {
        if (e.key === ' ') {
            if (this.spaceIsDown) {
                // Don't do anything if space is already down
                return;
            }

            this.spaceIsDown = true;
            if (this.isPanning) {
                // Don't do anything if it is panning
                return;
            }
            // this.element.style.cursor = 'grab';
            this.element.setStyle({ cursor: 'grab' });
            this.toolDisabler();
            document.addEventListener('mousedown', this.mouseDown);
            document.addEventListener('keyup', this.keyUp);
        }
    };

    private keyUp = (e: KeyboardEvent) => {
        if (e.key === ' ') {
            this.spaceIsDown = false;
            if (this.isPanning) {
                // Keep panning until the mouse is released
                return;
            }
            this.spaceIsDown = false;
            this.element.setStyle({ cursor: 'default' });
            this.toolEnabler();
            document.removeEventListener('mousedown', this.mouseDown);
        }
    };

    private mouseDown = () => {
        this.isPanning = true;
        this.element.setStyle({ cursor: 'grabbing' });
        document.addEventListener('mousemove', this.mouseMove);
        document.addEventListener('mouseup', this.mouseUp);
    };

    private mouseMove = (e: MouseEvent) => {
        e.preventDefault();
        const [dx, dy] = this.translateMovement(e);
        this.x -= dx;
        this.y -= dy;
        this.setElementViewBox();
    };

    private mouseUp = () => {
        this.isPanning = false;
        this.element.setStyle({ cursor: 'grab' });
        document.removeEventListener('mousemove', this.mouseMove);
        document.removeEventListener('mouseup', this.mouseUp);

        if (!this.spaceIsDown) {
            this.element.setStyle({ cursor: 'default' });
            this.toolEnabler();
            document.removeEventListener('mousedown', this.mouseDown);
        }
    };

    private zoom(d: 1 | -1) {
        this.scalePower += d;
        this.setElementViewBox();
    }

    private setElementViewBox() {
        const viewBox = `${this.x - this.viewBoxWidth / 2} `
            + `${this.y - this.viewBoxWidth / 2} `
            + `${this.viewBoxWidth} ${this.viewBoxWidth}`;
        this.element.setAttributes({ viewBox });
    }

    private get viewBoxWidth(): number {
        const scale = this.BASE ** this.scalePower;
        return this.STANDARD_VIEWBOX_WIDTH * scale;
    }

    private translateMovement(event: MouseEvent): [number, number] {
        const { width, height } = this.element.getBoundingBox();
        const centeredX = event.movementX;
        const centeredY = event.movementY;
        const minDimension = Math.min(width, height);
        const x = centeredX / minDimension * this.viewBoxWidth;
        const y = centeredY / minDimension * this.viewBoxWidth;
        return [x, y];
    }

    translateCoordinate(event: MouseEvent): [number, number] {
        const { width, height } = this.element.element.getBoundingClientRect();
        const centeredX = event.clientX - width / 2;
        const centeredY = event.clientY - height / 2;
        const minDimension = Math.min(width, height);
        const x = centeredX / minDimension * this.viewBoxWidth;
        const y = centeredY / minDimension * this.viewBoxWidth;
        return [
            x + this.x,
            y + this.y
        ];
    }
}