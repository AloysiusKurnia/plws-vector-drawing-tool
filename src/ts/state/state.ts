export abstract class AppState {
    protected readonly eventManager: EventManager;
    onControlPointClick(point: ControlPoint): void { }
    onSegmentClick(segment: CurveSegment): void { }
    onMouseMove(x: number, y: number): void { }
    onEscape(): void { }
    onSpace(): void { }
    onLetterB(): void { }
    onLetterR(): void { }
    onReleaseR(): void { }
    onLetterF(): void { }
    onNumber1(): void { }
    onNumber2(): void { }
    onNumber3(): void { }
    onNumber4(): void { }
}