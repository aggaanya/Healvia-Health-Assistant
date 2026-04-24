import { useEffect } from "react";

function useAutoscroll(containerRef, messages) {
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages]);

  return containerRef;
}

export default useAutoscroll;