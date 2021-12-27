---
"@alduino/api-utils": patch
---

api-utils now only supports ESModules to fix some issues with imports that apparently don't exist. This has not been classified as a major release to ease updating, as all current known uses for this library are already using ESModules. If you are not, you will need to switch before updating, or pin your version to 0.4.0.
