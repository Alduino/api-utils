# @alduino/api-utils

## 0.3.0

### Minor Changes

-   [#9](https://github.com/Alduino/api-utils/pull/9) [`f051186`](https://github.com/Alduino/api-utils/commit/f051186ae55649d02f3c68de4d513ce44d6db5c3) Thanks [@Alduino](https://github.com/Alduino)! - Added an SSR compatible request function that doesn't use React contexts or hooks. If you implement this function, you should use a request function that is compatible with both the browser and a Node context (like [`cross-fetch`](https://www.npmjs.com/package/cross-fetch)).

## 0.2.1

### Patch Changes

-   [#7](https://github.com/Alduino/api-utils/pull/7) [`8d57891`](https://github.com/Alduino/api-utils/commit/8d57891ac6a5eef6d18afaf7226fd334ecde4481) Thanks [@Alduino](https://github.com/Alduino)! - Export ApiContext type so that createContext() can be used with Typescript

## 0.2.0

### Minor Changes

-   [#2](https://github.com/Alduino/api-utils/pull/2) [`c4a0ebe`](https://github.com/Alduino/api-utils/commit/c4a0ebe47730073146c022c03e6b01cc96b8c9f7) Thanks [@Alduino](https://github.com/Alduino)! - Convert API context to a per-library value so they can have different configuration

*   [#4](https://github.com/Alduino/api-utils/pull/4) [`02382f1`](https://github.com/Alduino/api-utils/commit/02382f1df22618ec41b3832067d13e8ed0a80237) Thanks [@Alduino](https://github.com/Alduino)! - Added `useFetch` and `useFetchDeferred`, which are imperative alternatives to the normal hooks
