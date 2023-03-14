| State        | Action        | Behavior                                                                                              | Next state  |
| :----------- | :------------ | :---------------------------------------------------------------------------------------------------- | :---------- |
| (All states) | W, A, S, D    | Pan canvas                                                                                            | (Stay)      |
|              | Q, E          | Zoom canvas                                                                                           | (Stay)      |
|              | Shift         | Amplify key function                                                                                  | (Stay)      |
|              | Alt           | Diminish key function                                                                                 | (Stay)      |
|              | R, F          | Change all line thickness                                                                             | (Stay)      |
|              | Z             | Undo                                                                                                  | (Stay)      |
|              | C             | Copy mode                                                                                             | MultiSelect |
| Idle         | Element click | Select element (control point/segment)                                                                | (Stay)      |
|              | Space         | None on selection: prepare control point to draw a new curve on                                       | DrawInit    |
|              |               | Control point on selection: drag control point with nearby segments                                   | Drag        |
|              |               | Curve on selection: drag two of nearby control points along with its influenced segments              | Drag        |
|              | B             | Curve on selection, split it into two and drag the point along the curve                              | DragAlong   |
|              |               | Control point on selection: drag control point along the curve segment                                | DragAlong   |
|              | Arrow keys    | Fine-drag the selected objects.                                                                       | (Stay)      |
| DrawInit     | Empty click   | Create a new control point and make a new curve from it.                                              | Drawing     |
|              | Escape        | Cancel draw initialization                                                                            | Idle        |
|              | CP click      | Create a new curve from a control point.                                                              | Drawing     |
| Drawing      | CP click      | If it is the latest point: toggle sharp control point                                                 | (Stay)      |
|              |               | If it is not the point before the latest: finish the curve with the clicked control point as its end. | Idle        |
|              | Escape        | Finish the curve, with the last control point as its end.                                             | Idle        |
| Drag         | Arrow keys    | Fine-drag the selected objects.                                                                       | (Stay)      |
|              | R             | Go to rotate mode                                                                                     | Rotate      |
|              | F             | Flip the selection horizontally                                                                       | (Stay)      |
|              | Escape        | Cancel dragging, put everything moved back to its previous place                                      | Idle        |
|              | Click         | Done dragging                                                                                         | Idle        |
| MultiSelect  | Escape        | Cancel multi-select                                                                                   | Idle        |
|              | Element click | Select element (control point/segment)                                                                | (Stay)      |
|              | Space         | If anything is selected, copy it                                                                      | Drag        |
| Rotate       | Mouse move    | Rotate the element                                                                                    | (Stay)      |
|              | 1 2 3 4       | Rotate 180, 90, 60, and 45 degrees respectively. Alt to rotate CCW.                                   | (Stay)      |
|              | R release     | Go back to drag mode                                                                                  | Drag        |
| DragAlong    | Space         | Apply dragging                                                                                        | Idle        |
|              | Escape        | Cancel dragging, put everything moved back to its previous place                                      | Idle        |
