describe("Auth page", () => {
  context("720p resolution", () => {
    beforeEach(() => {
      /**
       * Run these tests as if in a desktop browser,
       * with a 720p monitor
       */
      cy.viewport(1280, 720);
    });

    describe("When signin", () => {
      before(() => {
        cy.visit(`/auth/signin`);

        cy.waitForReact();
      });

      describe("When login via magic link", () => {
        it("Should have the right email", () => {
          cy.get("[data-cy=login-error]").should("not.exist");
        });

        it("Should redirect participant to home", () => {
          cy.location("pathname").should("include", "/");
        });

        it("Should show a login success toast", () => {
          cy.get("[data-cy=login-toast]").should("exist");
        });
      });

      describe("When login via the wrong magic link", () => {
        it("Should have the wrong email", () => {
          cy.get("[data-cy=login-error]").should("not.exist");
        });

        it("Should redirect participant to home", () => {
          cy.location("pathname").should("include", "/");
        });

        it("Should show a login success toast", () => {
          cy.get("[data-cy=login-toast]").should("exist");
        });
      });
    });
  });
});
