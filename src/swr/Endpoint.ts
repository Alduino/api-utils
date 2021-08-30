import {RequestWithBody, RequestWithOptionalBody} from "./RequestWithBody";
import ApiContext from "../api-ctx";

type Fetch<Request, Response> = Request extends RequestWithBody<infer Body>
    ? (url: string, body: Body) => Response | Promise<Response>
    : Request extends RequestWithOptionalBody<infer Body>
    ? (url: string, body: Body | undefined) => Response | Promise<Response>
    : (url: string) => Response | Promise<Response>;

/**
 * A single endpoint (combination of path and HTTP method).
 *
 * Each endpoint should have a single instance of this type, which is then passed
 * to `useSwr` to use it.
 *
 * @example
 * const userEndpoint: Endpoint<UserRequest, UserResponse> = {
 *     apiContext,
 *     getKey({id}) {
 *         return key`users/${id}`;
 *     },
 *     fetch(url) {
 *         return fetch(url, {method: "GET"}).then(res => res.json());
 *     }
 * };
 */
export default interface Endpoint<Request, Response> {
    apiContext: ApiContext;

    /**
     * Fetch from the given URL and return the response parsed correctly for this
     * endpoint
     * @remarks The URL is always the value returned by this endpoint's `getKey()`
     */
    fetch: Fetch<Request, Response>;

    /**
     * Converts a request object into the action's path
     * @remarks Should be very fast, called on nearly every render.
     * @example
     * getKey({id: 7, query: "example"})
     * // ⇩
     * "repositories/7/search?query=example"
     */
    getKey(request: Request): string;
}
