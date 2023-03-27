import { EventController } from "observers/event-controller";
import { GroupCarrier } from "views/groups/group-carrier";
import { EndPoint } from "./components/end-point";
import { SplineSegment } from "./components/spline-segment";

/**
 * The factory that creates drawing elements. This factory is used to create
 * elements and initialize them with the correct event handlers.
 */
export class ElementFactory {
    /**
     * Creates a new element factory.
     * @param controlManager The event controller.
     * @param groupCarrier An object that holds all the groups.
     */
    constructor(
        private readonly controlManager: EventController,
        private readonly groupCarrier: GroupCarrier
    ) { }

    /**
     * Creates a new end point.
     * @param x The x-coordinate of the end point.
     * @param y The y-coordinate of the end point.
     */
    createEndPoint(x: number, y: number): EndPoint {
        const elem = new EndPoint(x, y, this.groupCarrier.endPointGroup);
        this.controlManager.registerEndpointEvents(elem);
        return elem;
    }

    /**
     * Creates a new spline segment.
     * @param endPoint0 The first end point of the spline segment.
     * @param endPoint1 The second end point of the spline segment.
     */
    createSplineSegment(
        endPoint0: EndPoint,
        endPoint1: EndPoint
    ): SplineSegment {

        const elem = new SplineSegment(
            endPoint0,
            endPoint1,
            this.groupCarrier.splineSegmentGroup,
            this.groupCarrier.intermediatePointGroup
        );
        this.controlManager.registerSegmentEvents(elem);
        this.controlManager.registerIntermediatePointEvents(
            elem.intermediatePoint0);
        this.controlManager.registerIntermediatePointEvents(
            elem.intermediatePoint1);
        return elem;
    }

}