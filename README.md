# API Utilities

This library contains a collection of utilities to build an API client.

## Tutorial

> This library is designed to be used by machine-generated code (i.e. swagger-codegen). It is probably going to be very tedious to write a library using it by hand.

### Re-exports

First off, there are some things you should re-export from the library, as they are meant for use by your library's user.

- `useSwr`, `useSwrInfinite`, `useFetch`, `useFetchDeferred`, `sendRequest`, `getEndpointUrl`, `useEndpointUrl`: These hooks and functions are the core of how your API will be used. If you use [wrapper functions](#wrapper-functions), you don't need to export these.
- `SWRConfiguration`, `SWRResponse`, `SWRInfiniteConfiguration`, `SWRInfiniteResponse`, `UseAsyncCallbackOptions`, `UseAsyncReturn`: Theses are various types used by `useSwr` and `useFetch` (re-exported from the `swr` and `react-async-hook` libraries)

### Usage

The library revolves around `Endpoint`s. These are how your library maps some request data to a URL to send the actual request to.

An endpoint implementation would look something like:

```typescript
import {Endpoint, key} from "@alduino/api-utils";

export interface Request {
    userId: string;
    size: number;
    body: string;
}

export interface Response {
    url: string;
}

export const userAvatarEndpoint: Endpoint<Request, Response> = {
    apiContext,
    getKey({userId, size}: Request) {
        return key`user/${userId}/avatar?${{size}}`;
    },
    fetch(url: string, body: string): Promise<Response> {
        return fetch(url, {
            credentials: "include",
            body: JSON.stringify(body)
        }).then(res => res.json());
    }
};
```

You can generate the `Request` interface by merging the URL parameters and the query parameters, then split them back out again via object destructuring in `getKey()`.

#### API Context

Notice the `apiContext` key in the endpoint above. This is an "API Context", which is what api-utils uses to map your keys to a full URL, as well as a way for a user to specify configuration for swr. The API context is based off of React Contexts.

In a file that can be imported by any endpoint files, add this code (it can be a static file, no generation is needed):

```typescript
import {createContext} from "@alduino/api-utils";

export const apiContext = createContext();
export const ApiProvider = context.Provider;
```

The `apiContext` export should then be used as the `apiContext` value you saw in the endpoint example above.

You need to export the `ApiProvider` to users of your library, as it is how they specify required configuration like the base URL.

### Library API

There are two forms your library's API can take: wrapper functions (recommended), or exposed endpoints. Wrapper functions are recommended because they provide a better DX.

#### Wrapper functions

> This form is recommended for better DX and API safety - each endpoint has its own hook, and it is not possible to `useInfinite` where it doesn't make sense.

With this form, you generate functions that wrap `useSwr`, `useFetch`, and `useFetchDeferred`, and provide the endpoint to it automatically. The generated code might look something like:

```typescript
import {useSwr, useFetch, useFetchDeferred, sendRequest, SWRConfiguration, SWRResponse} from "@alduino/api-utils";

export function useUserAvatar(
    request: Request,
    config?: SWRConfiguration
): SWRResponse<Response, Error> {
    return useSwr(userAvatarEndpoint, request, config, "useUserAvatar");
}

export function useUserAvatarFetch(
    request: Request,
    config?: UseAsyncCallbackOptions<Response>
): UseAsyncReturn<Response | null, []> {
    return useFetch(userAvatarEndpoint, request, config, "useUserAvatarFetch");
}

export function useUserAvatarFetchDeferred(
    config?: UseAsyncCallbackOptions<Response>
): UseAsyncReturn<Response | null, [Request | null]> {
    return useFetchDeferred(
        userAvatarEndpoint,
        config,
        "useUserAvatarFetchDeferred"
    );
}

export function sendUserAvatarRequest(baseUrl: string, request: Request): Promise<Response> {
    return sendRequest(userAvatarEndpoint, baseUrl, request);
}

export function getUserAvatarEndpointUrl(baseUrl: string, request: Omit<Request, "body">): string {
    return getEndpointUrl(userAvatarEndpoint, baseUrl, request);
}

export function useUserAvatarEndpointUrl(request: Omit<Request, "body">): string {
    return useEndpointUrl(userAvatarEndpoint, request, "useUserAvatarEndpointUrl");
}
```

Note the last parameter passed, this value should be the same as the name of your wrapper function, to provide better error messages.

This can then be consumed as:

```typescript
import {useUserAvatar} from "my-api-client";

// declarative mode: swr hook
const {data, error} = useUserAvatar({userId: "bob", size: 256});

// imperative mode: react-async-hook
const {result, error, execute} = useUserAvatarFetch({userId: "bob", size: 256});
execute();
```

You should also generate `useSwrInfinite` versions where relevant.

#### Exposed endpoints

If you do not want to generate wrapper functions, you can export your `Endpoint` values as well as the `useSwr`, `useSwrInfinite`, `useFetch`, and `useFetchDeferred` functions provided by this library. A user of your library can then call `useSwr` directly:

```typescript
import {useSwr, userAvatarEndpoint} from "my-api-client";

const {data, error} = useSwr(userAvatarEndpoint, {userId: "bob", size: 256});
```

## API

### `Endpoint<Request, Response>`

Tells the library how and where to send a request. An `Endpoint` has three keys:

#### `apiContext`

This is the React context returned from `createContext()` that specifies information like the base URL and default request options.

#### `getKey(request: Request)`

This function should convert the request into a URL, relative to the base URL (i.e. should not start with a `/`).

It is recommended that you use the `key` function for this, it makes it much neater. It’s also easy to generate code for.

#### `fetch(url: string, [body: Body])`

This function should send the actual request to the URL provided. The URL is created from the base URL passed to the `ApiProvider` as well as the return value of this endpoint’s `getKey` function.

Any other request options (method, cookies etc) should be hardcoded in the call here.

##### Body parameter

If a request requires a body parameter, set it as a field called `body` in the `Request` type. If this field exists, its value will be passed to this function as a second parameter.
