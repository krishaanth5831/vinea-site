/**
 * Shared by the inline script in the layout (a server module) and the theme
 * switch (a client one). It lives here, outside either, because a constant
 * exported from a "use client" file reaches the server as a reference, not a
 * string.
 */
export const THEME_KEY = "vinea-theme";

/** Browser-chrome colour for each theme, matching `--bg`. */
export const CHROME = { dark: "#090a0b", light: "#fbfbfb" } as const;
