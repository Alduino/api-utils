import {useCallback, useMemo} from "react";
import useSWR, {KeyLoader, SWRConfiguration, SWRResponse} from "swr";
import useSWRInfinite, {SWRInfiniteResponse} from "swr/infinite";
import invariant from "tiny-invariant";
import {useApiContext} from "../api-ctx";
import Endpoint from "./Endpoint";
import RequestLoader from "./RequestLoader";
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
    const ctx = useApiContext();
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
    const ctx = useApiContext();
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
