const section_route = {
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

describe("Section page", () => {
  // For desktop view
  context("720p resolution", () => {
    beforeEach(() => {
      /**
       * Run these tests as if in a desktop browser,
       * with a 720p monitor
       */
      cy.viewport(1280, 720);
    });

    describe("When user visited sections", () => {
      beforeEach(() => {
        cy.request(section_route).as("path");

        cy.get("@path").then((response: any) => {
          const path = response.body[0];
          cy.log("section_id: ", path.id);

          cy.visit(
            `/${encodeURIComponent(path.packages.id)}/${encodeURIComponent(
              path.id
            )}`
          );
        });

        cy.waitForReact();
      });

      it("Should have a running timer", () => {
        cy.get("[data-cy=timer-text]").should("not.have.value", "00:00:00");
      });

      it.only("Should allow user proceed to question page", () => {
        cy.get("[data-cy=start-button]").click();

        // UUID URL on question page are 111 characters length
        cy.get("@path").then((response: any) => {
          const path = response.body[0];

          const package_id = path.packages.id;
          const section_id = path.id;

          cy.log("section_id: ", section_id);

          cy.location("pathname").should("contain", `/${section_id}/`);
        });
      });
    });
  });
});
