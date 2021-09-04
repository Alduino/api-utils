---
"@alduino/api-utils": minor
---

Added an SSR compatible request function that doesn't use React contexts or hooks. If you implement this function, you should use a request function that is compatible with both the browser and a Node context (like [`cross-fetch`](https://www.npmjs.com/package/cross-fetch)).
