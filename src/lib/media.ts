export const breakpoints = {
  mobile: 640,
} as const;

export const media = {
  mobile: `@media (max-width: ${breakpoints.mobile}px)`,
} as const;
