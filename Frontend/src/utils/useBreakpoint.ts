import { useSyncExternalStore } from "react";

const breakpoints = {
  xs: "(min-width: 375px)",
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
} as const;

type Breakpoint = keyof typeof breakpoints;

export const useBreakpoint = (breakpoint: Breakpoint) => {
  const query = breakpoints[breakpoint];

  return useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia(query);

      media.addEventListener("change", callback);

      return () => {
        media.removeEventListener("change", callback);
      };
    },
    () => window.matchMedia(query).matches,
    () => false
  );
};