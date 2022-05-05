# cypress-cdp-coverage
Cypress plugin to collect coverage data directly from a Google Chrome instance.

## Important notes

- This plugin only works with **Google Chrome** because it relies on using Chrome Debugging Protocol to collect coverage data.

- The collected coverage data is a raw data in [Chrome Debugging Protocol’s native format](https://chromedevtools.github.io/devtools-protocol/tot/Profiler/#method-takePreciseCoverage). You need to use tools such as [v8-to-istanbul](https://github.com/istanbuljs/v8-to-istanbul) to convert it to a format you desire.

## Usage

In your Cypress `plugins/index.js` file:

```js
require('cypress-cdp-coverage/plugin')(on, config)
```

In your Cypress `support/index.js` file:

```js
import 'cypress-cdp-coverage/support'
```

When running Cypress, set the environment variable `CYCOV_COVERAGE` to a directory. When tests are run, the coverage data will be written to that directory.

## Prior art

This Cypress plugin is inspired by [v8-cypress-coverage-plugin](https://github.com/leftyio/v8-cypress-coverage-plugin). The main difference is that this plugin does not perform any post-processing on the coverage data and it is up to the user to do so.