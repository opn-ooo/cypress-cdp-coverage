/// <reference types="cypress" />

const CDP = require('chrome-remote-interface')
const fs = require('fs')
const path = require('path')

/** @type {CDP.Client | undefined} */
let cdp
let started = false

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
      await new Promise((resolve) => setTimeout(resolve, 100))
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
      'cypress-cdp-coverage:before': async () => {
        await start()
        return null
      },
      'cypress-cdp-coverage:beforeEach': async () => {
        await start()
        return null
      },
      'cypress-cdp-coverage:afterEach': async () => {
        return null
      },
      'cypress-cdp-coverage:after': async () => {
        if (!cdp) return null
        const coverage = await cdp.Profiler.takePreciseCoverage()
        const dir = process.env.CYPRESS_CDP_COVERAGE
        if (dir) {
          fs.mkdirSync(dir, { recursive: true })
          const file = path.join(dir, `cycov${Date.now()}.json`)
          fs.writeFileSync(file, JSON.stringify(coverage))
        }
        return null
      }
    })
  }
)

async function start() {
  if (!cdp) return
  if (started) return
  await cdp.Profiler.enable()
  await cdp.Profiler.startPreciseCoverage({
    callCount: true,
    detailed: true
  })
  started = true
}