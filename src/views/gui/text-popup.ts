import { COLOR, DIMENSION } from "constants/settings";
import { AnimationFrameController } from "observers/animation-frame-controller";
import { ZoomController } from "observers/zoom-controller";
import { TextWrapper } from "util/svg-wrapper";
import { SVGCanvas } from "views/canvas";

export class TextPopUp extends TextWrapper {
    private readonly opacityFadeInterval = 2 * 60; // Frames
    private opacityFadeCounter = 0;
    constructor(
        private canvas: SVGCanvas,
        private zoomController: ZoomController,
        animationController: AnimationFrameController,
    ) {
        super();
        this.style.display = 'none';
        this.style.fontSize = `${DIMENSION.textFontSize}`;
        this.style.fontFamily = `${DIMENSION.textFontFamily}`;
        this.style.fill = `${COLOR.black}`;

        this.style.textAnchor = 'middle';

        this.style.pointerEvents = 'none';
        this.style.userSelect = 'none';
        this.rescale();
        zoomController.doOnPanning(() => this.rescale());
        animationController.register(() => this.decreaseOpacity());
        this.appendTo(canvas);
    }

    displayText(text: string) {
        this.setText(text);
        this.style.display = 'block';
        this.opacityFadeCounter = this.opacityFadeInterval;
    }

    rescale() {
        const { width, height } = this.canvas.getBoundingBox();
        const [x, y] = this.zoomController.translatePosition(
            width / 2,
            height - DIMENSION.textMarginFromBottom,
            width,
            height,
        );
        const fontSize = DIMENSION.textFontSize
            * this.zoomController.getScaleFactor();
        this.style.fontSize = `${fontSize}pt`;
        this.setPosition(x, y);
    }

    decreaseOpacity() {
        if (this.opacityFadeCounter > 0) {
            this.opacityFadeCounter -= 1;
            const t = this.opacityFadeCounter / this.opacityFadeInterval;
            const easedT = 2 * t - t * t;
            this.style.opacity = `${easedT}`;
        }
    }
}