import { EndPointGroup } from "./end-point-group";
import { IntermediatePointGroup } from "./intermediate-point-group";
import { SplineSegmentGroup } from "./spline-segment-group";

/**
 * Any class that can hold all abstract group.
 */
export interface GroupCarrier {
    /** The group that holds all the end points. */
    readonly endPointGroup: EndPointGroup;
    /** The group that holds all the intermediate points. */
    readonly intermediatePointGroup: IntermediatePointGroup;
    /** The group that holds all the spline segments. */
    readonly splineSegmentGroup: SplineSegmentGroup;
}
