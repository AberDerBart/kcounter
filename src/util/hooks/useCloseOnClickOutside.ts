import { useEffect } from "react";

export default function useCloseOnClickOutside(
  ref: React.RefObject<HTMLElement>,
  close: () => void,
) {
  useEffect(() => {
    function handleClick(e: PointerEvent) {
      if (!ref.current || !e.target) {
        return;
      }
      if (
        e.target instanceof Node &&
        e.target.isConnected &&
        !ref.current.contains(e.target)
      ) {
        close();
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [close, ref]);
}
