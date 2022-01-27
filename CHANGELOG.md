# @alduino/api-utils

## 0.4.3

### Patch Changes

-   [`a104256`](https://github.com/Alduino/api-utils/commit/a10425696312b0022b7c1b4b1c6fbf637006cbe6) Thanks [@Alduino](https://github.com/Alduino)! - Upgraded SWR to 1.2 - using ESModules should now work properly, as this version of SWR adds the required .mjs files (see [swr#1758](https://github.com/vercel/swr/issues/1758))

## 0.4.2

### Patch Changes

-   [`4b99d28`](https://github.com/Alduino/api-utils/commit/4b99d283837624c03bd0b5a5fea83f4c9c7fea50) Thanks [@Alduino](https://github.com/Alduino)! - Fix issue where the library would expect a `React` global to exist

## 0.4.1

### Patch Changes

-   [`d6c8610`](https://github.com/Alduino/api-utils/commit/d6c861090261a3ec34dda99fba92ab836a2f0d3b) Thanks [@Alduino](https://github.com/Alduino)! - Update to SWR 1.1: Data passed to a useSwr hook is now automatically serialised, so you no longer need to add an extra line for `useMemo`

*   [`f5d3452`](https://github.com/Alduino/api-utils/commit/f5d34525195e859eeaf1106a178bc0fb83ec4f21) Thanks [@Alduino](https://github.com/Alduino)! - api-utils now only supports ESModules to fix some issues with imports that apparently don't exist. This has not been classified as a major release to ease updating, as all current known uses for this library are already using ESModules. If you are not, you will need to switch before updating, or pin your version to 0.4.0.

## 0.4.0

### Minor Changes

-   [#13](https://github.com/Alduino/api-utils/pull/13) [`da9a78b`](https://github.com/Alduino/api-utils/commit/da9a78bb789f99d682b0fd77c95d213d574bd71e) Thanks [@Alduino](https://github.com/Alduino)! - Removed the option to pass `null` to the non-SWR functions. Means it also doesn't have `null` as a possible return either.

### Patch Changes

-   [`c65276c`](https://github.com/Alduino/api-utils/commit/c65276c9e9211bccd54fe4de533ccacc62f2b48b) Thanks [@Alduino](https://github.com/Alduino)! - Update `@alduino/pkg-lib` to v0.6.0

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
