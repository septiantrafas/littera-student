import dayjs from "dayjs";

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

    describe("When user visited controlled sections", () => {
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

        cy.window()
          .its("TimeStore")
          .invoke("updateEndTime", dayjs().add(5, "minute").toISOString());

        cy.waitForReact();
      });

      it("Should have a ticking timer", () => {
        cy.wait(1000);
        cy.get("[data-cy=timer-text]").then((timer) => {
          const timer_text = timer.text();
          cy.get("[data-cy=timer-text]").should("not.have.value", timer_text);
        });
      });

      it("Should have start button working", () => {
        cy.get("[data-cy=start-button]").click();

        // Check if route provided by the button is valid
        cy.get("@path").then((response: any) => {
          const path = response.body[0];

          const package_id = path.packages.id;
          const section_id = path.id;

          cy.log("section_id: ", section_id);

          cy.location("pathname").should("contain", `/${section_id}/`);
        });
      });
    });

    describe("When user visited uncontrolled sections", () => {
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

        cy.window()
          .its("TimeStore")
          .invoke("updateEndTime", dayjs().add(5, "minute").toISOString());

        cy.waitForReact();
      });

      it("Should have a ticking timer", () => {
        cy.wait(1000);
        cy.get("[data-cy=timer-text]").then((timer) => {
          const timer_text = timer.text();
          cy.get("[data-cy=timer-text]").should("not.have.value", timer_text);
        });
      });

      it("Should not have a start button", () => {
        cy.get("[data-cy=start-button]").should("not.exist");
      });

      it("Should redirect automatically", () => {
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
