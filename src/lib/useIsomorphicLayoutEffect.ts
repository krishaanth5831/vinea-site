"use client";

import { useEffect, useLayoutEffect } from "react";

/**
 * Layout effect in the browser, plain effect on the server, so setting an
 * element's starting state before paint does not warn during prerender.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
