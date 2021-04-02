describe('Section page', () => {
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
            describe('Link for accessing packages', () => {
                it('Should navigate to the first sections of the package', () => {
                    cy.get('[data-cy=package-link]').first().click()
                    cy.wait(1000)
                })
                describe('Timer value is changing', () => {
                    it('Should have a dynamic value', () => {
                        cy.get('[data-cy=timer-text]').should('not.have.value', '00:00:00')
                    })
                })
                describe('User can proceed by using button', () => {
                    it('Should redirect user to question page', () => {
                        cy.get('[data-cy=start-button]').click()
                        // UUID on question page are 111 characters length
                        cy.url().should('have.length.above', 111)
                    })
                })
            })
        })
    })
})