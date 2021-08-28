# API Utilities

This library contains a collection of utilities to build an API client.

## Tutorial

> This library is designed to be used by machine-generated code (i.e. swagger-codegen).
> It is probably going to be very tedious to write a library using it by hand.

### Re-exports

First off, there are some things you should re-export from the library, as they are meant for use by your library's
user.

-   `ApiProvider`: This component tells the library where the API is located, and allows the user to supply default
    configuration to SWR
-   `useSwr`, `useSwrInfinite`: These hooks are the core of how your API will be used. If you use wrapper functions, you
    don't need to export these.
-   `SWRConfiguration`, `SWRResponse`, `SWRInfiniteConfiguration`, `SWRInfiniteResponse`: Theses are various types used
    by `useSwr` (re-exported from the `swr` library)

### Usage

The library revolves around `Endpoint`s. These are how your library maps some request data to a URL to send the actual
request to.

An endpoint implementation would look something like:

```typescript
import {Endpoint, key} from "@rg/api-utils";

export interface Request {
    userId: string;
    size: number;
    body: string;
}

export interface Response {
    url: string;
}

export const userAvatarEndpoint: Endpoint<Request, Response> = {
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

You can generate the `Request` interface by merging the URL parameters and the query parameters, then split them back
out again via object destructuring in `getKey()`.

### Library API

There are two forms your library's API can take: wrapper functions (recommended), or exposed endpoints. Wrapper
functions are recommended because they provide a better DX.

#### Wrapper functions

> This form is recommended for better DX and API safety - each endpoint has its own hook, and it is not possible
> to `useInfinite` where it doesn't make sense.

With this form, you generate functions that wrap `useSwr` and provide the endpoint to it automatically. The generated
code might look something like:

```typescript
import {useSwr} from "@rg/api-utils";
import {SWRConfiguration, SWRResponse} from "swr";

export function useUserAvatar(
    request: Request,
    config?: SWRConfiguration
): SWRResponse<Response, Error> {
    return useSwr(userAvatarEndpoint, request, config, "useUserAvatar");
}
```

Note the last parameter passed, this value should be the same as the name of your wrapper function, to provide better
error messages.

This can then be consumed as:

```typescript
import {useUserAvatar} from "my-api-client";

const {data, error} = useUserAvatar({userId: "bob", size: 256});
```

You should also generate `useSwrInfinite` versions where relevant.

#### Exposed endpoints

If you do not want to generate wrapper functions, you can export your `Endpoint` values as well as the `useSwr`
and `useSwrInfinite` functions provided by this library. A user of your library can then call `useSwr` directly:

```typescript
import {useSwr, userAvatarEndpoint} from "my-api-client";

const {data, error} = useSwr(userAvatar, {userId: "bob", size: 256});
```

## API

### `Endpoint<Request, Response>`

Tells the library how and where to send a request. An `Endpoint` has two keys:

#### `getKey(request: Request)`

This function should convert the request into a URL, relative to the base URL (i.e. should not start with a `/`).

It is recommended that you use the `key` function for this, it makes it much neater. It’s also easy to generate code
for.

#### `fetch(url: string, [body: Body])`

This function should send the actual request to the URL provided. The URL is created from the base URL passed to
the `ApiProvider` as well as the return value of this endpoint’s `getKey` function.

Any other request options (method, cookies etc) should be hardcoded in the call here.

##### Body parameter

If a request requires a body parameter, set it as a field called `body` in the `Request` type. If this field exists, its
value will be passed to this function as a second parameter.
