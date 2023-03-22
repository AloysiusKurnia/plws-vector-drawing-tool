/**
 * The color of the elements.
 */
export const COLOR = {
    black: "#000",
    lightBlack: "#666",
    white: "#fff",
    darkWhite: "#ddd",
    endPoint: "#f00",
    endPointHover: "#fcc",
    endPointSelected: "#aaa",
    intermediatePoint: "#eee",
    intermediatePointHover: "#aaa",
    intermediatePointSelected: "#fff",
    segmentSelected: "#888",
} as const;

/**
 * The dimension of the elements, given that the zoom level is the default.
 */
export const DIMENSION = {
    endPointRadius: 4,
    endPointStrokeWidth: 1,
    segmentWidth: 2.5,
} as const;

/**
 * The ID of the elements, used for referencing (e.g. in the <use> tag).
 */
export const ID = {
    endPoint: "control-point",
    intermediatePoint: "intermediate-point",
}