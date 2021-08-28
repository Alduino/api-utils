import invariant from "tiny-invariant";
import Endpoint from "./Endpoint";

/**
 * Gets the URL form the endpoint and its request, and joins it with the base URL
 * @remarks This is an internal function. It might change unexpectedly.
 * @param endpoint The endpoint to get the URL of
 * @param request The request object
 * @param baseUrl The base URL/domain. Must end with a forward slash.
 * @private
 */
export default function getUrlFromEndpoint<Request>(
    endpoint: Omit<Endpoint<Request, unknown>, "fetch">,
    request: Request,
    baseUrl: string
): string {
    invariant(
        baseUrl.endsWith("/"),
        "Base URL must end with a forward slash (`/`) to prevent issues with relative paths"
    );

    const key = endpoint.getKey(request);
    return new URL(key, baseUrl).toString();
}
