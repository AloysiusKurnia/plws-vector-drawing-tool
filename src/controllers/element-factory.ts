import { EventController } from "observers/event-controller";
import { EndPointGroup } from "views/groups/end-point-group";
import { IntermediatePointGroup } from "views/groups/intermediate-point-group";
import { SplineSegmentGroup } from "views/groups/spline-segment-group";
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
     * @param endPointGroup
     * The group that contains all the end points.
     * @param splineSegmentGroup
     * The group that contains all the spline segments.
     * @param intermediatePointGroup
     * The group that contains all the intermediate points.
     */
    constructor(
        private readonly controlManager: EventController,
        private readonly endPointGroup: EndPointGroup,
        private readonly splineSegmentGroup: SplineSegmentGroup,
        private readonly intermediatePointGroup: IntermediatePointGroup,
    ) { }

    /**
     * Creates a new end point.
     * @param x The x-coordinate of the end point.
     * @param y The y-coordinate of the end point.
     */
    createEndPoint(x: number, y: number): EndPoint {
        const elem = new EndPoint(x, y, this.endPointGroup);
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
            this.splineSegmentGroup,
            this.intermediatePointGroup
        );
        this.controlManager.registerSegmentEvents(elem);
        this.controlManager.registerIntermediatePointEvents(
            elem.intermediatePoint0);
        this.controlManager.registerIntermediatePointEvents(
            elem.intermediatePoint1);
        return elem;
    }

}