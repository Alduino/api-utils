import {useCallback, useMemo} from "react";
import {
    useAsyncCallback,
    UseAsyncCallbackOptions,
    UseAsyncReturn
} from "react-async-hook";
import useSWR, {KeyLoader, SWRConfiguration, SWRResponse} from "swr";
import useSWRInfinite, {SWRInfiniteResponse} from "swr/infinite";
import invariant from "tiny-invariant";
import Endpoint from "./Endpoint";
import RequestLoader from "./RequestLoader";
import {isRequestWithBody, RequestWithBody} from "./RequestWithBody";
import getRequestArguments from "./getRequestArguments";
import getUrlFromEndpoint from "./getUrlFromEndpoint";

/**
 * Load a piece of data from the specified endpoint
 * @param endpoint The endpoint to send the request to
 * @param request Data for the request
 * @param config Extra configuration for SWR
 * @param _fnName Internal parameter for library usage only
 */
export function useSwr<Request, Response>(
    endpoint: Endpoint<Request, Response>,
    request: Request | null | (() => Request | null),
    config?: SWRConfiguration,
    _fnName = "useSwr"
): SWRResponse<Response, Error> {
    const ctx = endpoint.apiContext.use();
    invariant(
        ctx !== null,
        `${_fnName} is being used in a component that is not wrapped by <ApiProvider />`
    );
    const {baseUrl, swrConfig} = ctx;

    const args = useMemo(() => {
        if (request === null) return null;

        if (typeof request === "function") {
            return () => {
                const req = (request as () => Request)();
                if (req === null) return null;
                return getRequestArguments(
                    req,
                    getUrlFromEndpoint(endpoint, req, baseUrl)
                );
            };
        } else {
            return getRequestArguments(
                request,
                getUrlFromEndpoint(endpoint, request, baseUrl)
            );
        }
    }, [request, endpoint, baseUrl]);

    return useSWR<Response, Error>(args, endpoint.fetch, {
        ...swrConfig,
        ...config
    });
}

/**
 * Load multiple pieces of paginated data from the specified endpoint
 * @param endpoint The endpoint to send the request to
 * @param request Data for the request
 * @param config Extra configuration for SWR
 * @param _fnName Internal parameter for library usage only
 */
export function useSwrInfinite<Request, Response>(
    endpoint: Endpoint<Request, Response>,
    request: RequestLoader<Request, Response>,
    config?: SWRConfiguration,
    _fnName = "useSwrInfinite"
): SWRInfiniteResponse<Response, Error> {
    const ctx = endpoint.apiContext.use();
    invariant(
        ctx !== null,
        `${_fnName} is being used in a component that is not wrapped by <ApiProvider />`
    );
    const {baseUrl, swrConfig} = ctx;

    const url = useCallback<Exclude<KeyLoader<Response>, null>>(
        (idx, prevRes) => {
            const reqRes = request(idx, prevRes);
            if (reqRes == null) return null;
            return getRequestArguments(
                reqRes,
                getUrlFromEndpoint(endpoint, reqRes, baseUrl)
            );
        },
        [request, endpoint.getKey, baseUrl]
    );

    return useSWRInfinite(url, endpoint.fetch, {...swrConfig, ...config});
}

/**
 * Runs the request when the callback is executed (using `react-async-hook`'s `useAsyncCallback`). Request is passed
 * to the hook instead of the `execute` function.
 * @param endpoint The endpoint to send the request to
 * @param request Data for the request
 * @param config Extra configuration for `useAsyncCallback`
 * @param _fnName Internal parameter for library usage only
 */
export function useFetch<Request, Response>(
    endpoint: Endpoint<Request, Response>,
    request: Request | null | (() => Request | null),
    config?: UseAsyncCallbackOptions<Response>,
    _fnName = "useFetch"
): UseAsyncReturn<Response | null, []> {
    type Body = Request extends RequestWithBody<infer Body> ? Body : never;

    const ctx = endpoint.apiContext.use();
    invariant(
        ctx !== null,
        `${_fnName} is being used in a component that is not wrapped by <ApiProvider />`
    );
    const {baseUrl, fetchConfig} = ctx;

    const fullConfig = useMemo(
        () => ({
            ...fetchConfig,
            ...config
        }),
        [fetchConfig, config]
    ) as UseAsyncCallbackOptions<Response | null>;

    const args = useMemo(() => {
        if (request === null) return null;

        if (typeof request === "function") {
            return () => {
                const req = (request as () => Request)();
                if (req === null) return null;
                const url = getUrlFromEndpoint(endpoint, req, baseUrl);
                if (isRequestWithBody(req))
                    return [url, req.body] as [string, Body];
                return [url] as [string, Body?];
            };
        } else {
            const url = getUrlFromEndpoint(endpoint, request, baseUrl);
            if (isRequestWithBody(request))
                return [url, request.body] as [string, Body];
            return [url] as [string, Body?];
        }
    }, [request, endpoint, baseUrl]);

    const fn = useCallback(async () => {
        if (request === null) return null;
        const argsVal = typeof args === "function" ? args() : args;
        if (argsVal === null) return null;

        return await endpoint.fetch(...argsVal);
    }, [args, endpoint]);

    return useAsyncCallback<Response | null, []>(fn, fullConfig);
}

/**
 * Runs the request when the callback is executed (using `react-async-hook`'s `useAsyncCallback`). Request is passed
 * to the `execute` function instead of the hook.
 * @param endpoint The endpoint to send the request to
 * @param config Extra configuration for `useAsyncCallback`
 * @param _fnName Internal parameter for library use only
 */
export function useFetchDeferred<Request, Response>(
    endpoint: Endpoint<Request, Response>,
    config?: UseAsyncCallbackOptions<Response>,
    _fnName = "useFetchDeferred"
): UseAsyncReturn<Response | null, [Request | null]> {
    type Body = Request extends RequestWithBody<infer Body> ? Body : never;

    const ctx = endpoint.apiContext.use();
    invariant(
        ctx !== null,
        `${_fnName} is being used in a component that is not wrapped by <ApiProvider />`
    );
    const {baseUrl, fetchConfig} = ctx;

    const fullConfig = useMemo(
        () => ({
            ...fetchConfig,
            ...config
        }),
        [fetchConfig, config]
    ) as UseAsyncCallbackOptions<Response | null>;

    const loadArgs = useCallback((request: Request | null) => {
        if (request === null) return null;

        const url = getUrlFromEndpoint(endpoint, request, baseUrl);
        if (isRequestWithBody(request))
            return [url, request.body] as [string, Body];
        return [url] as [string, Body?];
    }, [baseUrl]);

    const fn = useCallback(async (req: Request | null) => {
        if (req === null) return null;
        const args = loadArgs(req);
        if (args === null) return null;

        return await endpoint.fetch(...args);
    }, [loadArgs, endpoint]);

    return useAsyncCallback<Response | null, [Request | null]>(fn, fullConfig);
}
