describe('Home page', () => {
    // For desktop view
    context('720p resolution', () => {
        beforeEach(() => {
            /**
             * Run these tests as if in a desktop browser,
             * with a 720p monitor
             */
            cy.viewport(1280, 720)
        })
        describe('When you visit home', () => {
            it('Should visit home page', () => {
                cy.visit('/')
            });
            describe('Call to Action for Sign-in', () => {
                it('Should navigate to Sign-in page', () => {
                    cy.get('[data-cy=signin-link]').contains('here').click()
                    cy.wait(1000)
                    cy.url().should('include', '/auth/signin')
                })
            })
        })
    })
})