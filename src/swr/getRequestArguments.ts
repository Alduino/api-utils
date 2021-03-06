import {isRequestWithBody, RequestWithBody} from "./RequestWithBody";

export type RequestArguments<Request> = Request extends RequestWithBody<infer Body> ? [string, Body] : string;

/**
 * Returns the arguments to pass to the endpoint fetch function
 * @remarks This is an internal function. It might change unexpectedly.
 * @param req The endpoint's request
 * @param url The URL to fetch
 * @private
 */
export default function getRequestArguments<Request>(
    req: Request,
    url: string
): RequestArguments<Request> {
    if (isRequestWithBody(req))
        return [url, req.body] as const as ReturnType<
            typeof getRequestArguments
        >;
    return url as ReturnType<typeof getRequestArguments>;
}
