before(() => {
  cy.task('cypress-cdp-coverage:before')
})

beforeEach(() => {
  cy.task('cypress-cdp-coverage:beforeEach')
})

afterEach(() => {
  cy.task('cypress-cdp-coverage:afterEach')
})

after(() => {
  cy.task('cypress-cdp-coverage:after')
})
