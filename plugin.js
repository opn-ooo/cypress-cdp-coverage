/// <reference types="cypress" />

const CDP = require('chrome-remote-interface')
const fs = require('fs')
const path = require('path')

/** @type {CDP.Client | undefined} */
let cdp

/**
 * @param {number} port
 */
async function connectToCDP(port) {
  for (;;) {
    try {
      const client = await new CDP({ port })
      cdp = client
      started = false
      cdp.on('disconnect', () => {
        cdp = undefined
      })
      return
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }
}

module.exports = /** @type {Cypress.PluginConfig} */ (
  (on, config) => {
    on('before:browser:launch', async (browser, launchOptions) => {
      /** @type {number | undefined} */
      let port
      for (const arg of launchOptions.args) {
        if (arg.startsWith('--remote-debugging-port')) {
          port = arg.split('=')[1]
          break
        }
      }

      if (!port) {
        return
      }

      connectToCDP(port)
    })
    on('task', {
      'cycov:before': async () => {
        return null
      },
      'cycov:beforeEach': async () => {
        if (!cdp) return null
        await cdp.Profiler.enable()
        const callCount = true
        const detailed = true
        await cdp.Profiler.startPreciseCoverage(callCount, detailed)
        return null
      },
      'cycov:afterEach': async () => {
        if (!cdp) return null
        const coverage = await cdp.Profiler.takePreciseCoverage()
        const dir = process.env.CYCOV_COVERAGE
        if (dir) {
          fs.mkdirSync(dir, { recursive: true })
          const file = path.join(dir, `cycov${Date.now()}.json`)
          fs.writeFileSync(file, JSON.stringify(coverage))
        }
        return null
      },
      'cycov:after': async () => {
        return null
      }
    })
  }
)
