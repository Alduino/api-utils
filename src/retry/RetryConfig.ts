export default interface RetryConfig {
    /**
     * Checks if the request should be tried again.
     * @param cause The error that the `fetch` call threw.
     */
    check(cause: Error): boolean;

    /**
     * The number of milliseconds, used as the base for the delay.
     * For example, a value of 1000 means the first delay is ~1000 ms, the second is ~2000 ms etc.
     * @default 1000
     */
    delayMultiplier?: number;

    /**
     * The upper limit on the delay between requests.
     * @default 60000
     */
    maxDelay?: number;
}
