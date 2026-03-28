export const DragMotionResult = {
    NO_DROP: 0,
    COPY_DROP: 1,
    MOVE_DROP: 2,
    CONTINUE: 3
};

export function makeDraggable(actor, params) {
    actor._isDraggable = true;
    actor._dragParams = params;
    return {};
}
