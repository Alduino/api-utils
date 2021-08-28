export interface RequestWithBody<T> {
    body: T;
}

export interface RequestWithOptionalBody<T> {
    body?: T;
}

/**
 * Checks if the request has a body
 * @remarks This is an internal function. It might change unexpectedly.
 * @param obj The request
 * @private
 */
export function isRequestWithBody(
    obj: unknown
): obj is RequestWithBody<unknown> {
    if (!obj) return false;
    if (typeof obj !== "object") return false;
    return "body" in (obj as RequestWithBody<unknown>);
}
