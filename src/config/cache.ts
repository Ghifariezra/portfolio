const MINUTE = 60 * 1000;

/**
 * staleTime mengikuti TTL cache di API:
 *   /api/v1/public/*      s-maxage 5 menit
 *   /projects/:repo       10 menit
 *   /azure/.../analytics  1 jam
 */
export const STALE_TIME = {
    PORTFOLIO: 5 * MINUTE,
    GITHUB: 10 * MINUTE,
    STORE_ANALYTICS: 60 * MINUTE,
} as const;
