/**
 * The color of the elements.
 */
export const COLOR = {
    black: "#000",
    lightBlack: "#666",
    white: "#fff",
    darkWhite: "#ddd",

    endPoint: "#f00",
    endPointHover: "#faa",
    endPointSelected: "#ff0",
    endPointSelectedStroke: "#660",

    intermediatePoint: "#eee",
    intermediatePointHover: "#fff",
    intermediatePointSelected: "#ff0",
    intermediateLine: "#aaa",

    segmentSelected: "#888",
} as const;

/**
 * The dimension of the elements, given that the zoom level is the default.
 */
export const DIMENSION = {
    endPointRadius: 4.5,
    pointStrokeWidth: 1,

    intermediatePointRadius: 3.5,

    intermediateLineWidth: 2.5,
    segmentWidth: 3.75,

    textFontSize: 12,
    textFontFamily: "consolas",
    textMarginFromBottom: 5,
} as const;

/**
 * The ID of the elements, used for referencing (e.g. in the <use> tag).
 */
export const ID = {
    endPoint: "control-point",
    intermediatePoint: "intermediate-point",
};