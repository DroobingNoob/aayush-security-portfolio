import { useRef } from "react";

export default function useSwipe(onSwipe, ignoreControls = false) {
  const start = useRef(null);
  return {
    onPointerDown(event) {
      if (
        event.pointerType === "mouse" ||
        !event.isPrimary ||
        (ignoreControls && event.target.closest("button, input, label"))
      )
        return;
      start.current = {
        x: event.clientX,
        y: event.clientY,
        id: event.pointerId,
      };
    },
    onPointerUp(event) {
      if (!start.current || start.current.id !== event.pointerId) return;
      const dx = event.clientX - start.current.x;
      const dy = event.clientY - start.current.y;
      start.current = null;
      if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.5)
        onSwipe(dx < 0 ? 1 : -1);
    },
    onPointerCancel() {
      start.current = null;
    },
  };
}
