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

    describe("Verified participant can join test", () => {
      before(() => {
        cy.request(lobby_route).as("path");

        cy.get("@path").then((response: any) => {
          const path = response.body[0];
          cy.log("section_id: ", path.id);

          cy.visit(`/${encodeURIComponent(path.packages.id)}/lobby`);
        });

        cy.waitForReact();
      });

      it("Should be an eligible participant", () => {
        cy.getReact("Lobby")
          .getCurrentState()
          .should("include", { isEligible: true });
      });

      it("Should be wait for redirection", () => {
        cy.getReact("Lobby").getProps().as("next_path");

        cy.get("@next_path").then((props: any) => {
          cy.getReact("Lobby")
            .getCurrentState()
            .should("include", { redirectPath: `/${props.paths.id}` });
        });
      });

      it("Should be connected with users camera", () => {
        // TODO: Search for camera requirement check on cypress docs
      });
    });

    describe("Unverified participant can't join test", () => {
      before(() => {
        cy.request(lobby_route).as("path");

        cy.get("@path").then((response: any) => {
          const path = response.body[0];
          cy.log("section_id: ", path.id);

          cy.visit(`/${encodeURIComponent(path.packages.id)}/lobby`);
        });

        cy.waitForReact();
      });

      it("Should not be an eligible participant", () => {
        cy.getReact("Lobby")
          .getCurrentState()
          .should("include", { isEligible: false });
      });

      it("Should redirected to verification page", () => {
        cy.getReact("Lobby")
          .getCurrentState()
          .should("include", { redirectPath: `/verification` });
      });
    });
  });
});
