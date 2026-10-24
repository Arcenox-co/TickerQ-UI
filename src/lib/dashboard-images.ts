/**
 * Dashboard screenshots are recaptured from the documentation demo. Bump this version whenever they
 * change so browsers and CDNs fetch the new images instead of cached copies with the same name.
 */
export const dashboardScreenshotVersion = '2026-10-24';

export function dashboardScreenshot(name: string): string {
  return `/images/dashboard/${name}.jpg?v=${dashboardScreenshotVersion}`;
}
