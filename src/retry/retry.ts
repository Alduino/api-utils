import RetryConfig from "./RetryConfig";
import {getRetryDelay} from "./getRetryDelay";

const DEFAULT_DELAY_MULTIPLIER = 1000;
const DEFAULT_MAX_DELAY = 60000;

export default async function doWithRetries<T>(
    fetchFn: () => Promise<T>,
    config: RetryConfig
): Promise<T> {
    const {
        check,
        delayMultiplier = DEFAULT_DELAY_MULTIPLIER,
        maxDelay = DEFAULT_MAX_DELAY
    } = config;

    for (let i = 0; ; i++) {
        try {
            return await fetchFn();
        } catch (err) {
            if (err instanceof Error && check(err)) {
                const timeout = getRetryDelay(i, delayMultiplier, maxDelay);
                await new Promise(yay => setTimeout(yay, timeout));
            } else {
                throw err;
            }
        }
    }
}
