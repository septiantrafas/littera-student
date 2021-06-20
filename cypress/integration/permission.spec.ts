// TODO: Fill and test the specs
const permission_route = {
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

describe("Permission page", () => {
  context("720p resolution", () => {
    beforeEach(() => {
      /**
       * Run these tests as if in a desktop browser,
       * with a 720p monitor
       */
      cy.viewport(1280, 720);
    });

    describe("When accessing permission route", () => {
      before(() => {
        cy.request(permission_route).as("path");

        cy.get("@path").then((response: any) => {
          const path = response.body[0];
          cy.log("section_id: ", path.id);

          cy.visit(`/${encodeURIComponent(path.packages.id)}/permission`);
        });

        cy.waitForReact();
      });

      describe("Verify media permission", () => {
        it("Should turn camera status to emerald", () => {
          cy.get("[data-cy=camera-status]").should(
            "have.css",
            "background-color",
            "rgb(34, 197, 94)"
          );
        });

        it("Should turn mic status to emerald", () => {
          cy.get("[data-cy=microphone-status]").should(
            "have.css",
            "background-color",
            "rgb(34, 197, 94)"
          );
        });
      });
    });
  });
});
