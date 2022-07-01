/**
 * Gets the amount of delay before retrying, using exponential backoff.
 */
export function getRetryDelay(requestNumber: number, multiplier: number, max: number): number {
    const base = Math.min(Math.pow(2, requestNumber) * multiplier, max);
    return Math.random() * base;
}
