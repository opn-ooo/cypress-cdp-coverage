before(() => {
  cy.task('cycov:before')
})

beforeEach(() => {
  cy.task('cycov:beforeEach')
})

afterEach(() => {
  cy.task('cycov:afterEach')
})

after(() => {
  cy.task('cycov:after')
})
