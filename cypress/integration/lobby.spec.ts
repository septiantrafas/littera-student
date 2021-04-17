const lobby_route = {
  method: "GET",
  url: `${Cypress.env("SUPABASE_URL")}/rest/v1/sections`,
  headers: {
    apiKey: Cypress.env("SUPABASE_ANON_KEY"),
    Range: "0",
  },
  auth: {
    bearer: Cypress.env("SUPABASE_SERVICE_KEY"),
  },
  qs: {
    select: "id,packages:package_id(id)",
  },
};

describe("Lobby page", () => {
  // For desktop view
  context("720p resolution", () => {
    beforeEach(() => {
      /**
       * Run these tests as if in a desktop browser,
       * with a 720p monitor
       */
      cy.viewport(1280, 720);
    });

    describe.only("When you visit lobby", () => {
      before(() => {
        cy.request(lobby_route).as("path");

        cy.get("@path").then((response: any) => {
          const path = response.body[0];
          cy.log("section_id: ", path.id);

          cy.visit(`/${encodeURIComponent(path.packages.id)}/lobby`);
        });

        cy.waitForReact();
      });

      it("Should be able to redirect user to next section", () => {
        cy.getReact("Lobby").getProps().as("next_path");

        cy.get("@next_path").then((props: any) => {
          cy.getReact("Lobby")
            .getCurrentState()
            .should("include", { isEligible: true });

          cy.getReact("Lobby")
            .getCurrentState()
            .should("include", { redirectPath: `/${props.paths.id}` });
        });
      });

      it("Should be able to redirect user to verification page", () => {
        cy.getReact("Lobby").getProps().as("next_path");

        cy.get("@next_path").then((props: any) => {
          cy.getReact("Lobby")
            .getCurrentState()
            .should("include", { isEligible: false });

          cy.getReact("Lobby")
            .getCurrentState()
            .should("include", { redirectPath: "/verification" });
        });
      });
    });
  });
});
