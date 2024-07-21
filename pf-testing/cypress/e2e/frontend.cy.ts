import { zeroPad } from "../../utils";

before(() => {
  const url = Cypress.env("BACKEND_URL");
  cy.request({
    method: "POST",
    url: `${url}/todo/all`,
  });
});

describe("Frontend", () => {
  it("connects", () => {
    const url = Cypress.env("FRONTEND_URL");
    cy.visit(url);
  });
  it("creates todo", () => {
    const url = Cypress.env("FRONTEND_URL");
    const now = new Date()

    const text = now.getTime().toString();
    const dueDate = `${now.getFullYear()}-${zeroPad(now.getMonth())}-${zeroPad(now.getDate())}`;
    const location = "Location A"

    cy.visit(url);

    cy.get("[data-cy='input-text']").type(text);
    cy.get("[data-cy='due-date-input-text']").type(dueDate);
    cy.get("[data-cy='location-input-text']").type(location);
    cy.get("[data-cy='submit']").click();

    cy.contains(text);
    cy.contains(location);
  });

  it("deletes todo", () => {
    const url = Cypress.env("FRONTEND_URL");
    const now = new Date()

    const text = now.getTime().toString();
    const dueDate = `${now.getFullYear()}-${zeroPad(now.getMonth())}-${zeroPad(now.getDate())}`;
    const location = "Location B"

    cy.visit(url);
    cy.get("[data-cy='input-text']").type(text);
    cy.get("[data-cy='due-date-input-text']").type(dueDate);
    cy.get("[data-cy='location-input-text']").type(location);
    cy.get("[data-cy='submit']").click();

    cy.get("[data-cy='todo-item-wrapper']")
      .contains(text)
      .parent()
      .within(() => {
        cy.get("[data-cy='todo-item-delete']").click();
      });
    cy.contains(text).should("not.exist");
    cy.contains(location).should("not.exist");
  });

  it("updates todo", () => {
    const url = Cypress.env("FRONTEND_URL");

    const now = new Date()

    const text = now.getTime().toString();
    const dueDate = `${now.getFullYear()}-${zeroPad(now.getMonth())}-${zeroPad(now.getDate())}`;
    const location = "Location C"

    const textUpdated = "123456";
    const locationUpdated = "Location K"

    cy.visit(url);
    cy.get("[data-cy='input-text']").type(text);
    cy.get("[data-cy='due-date-input-text']").type(dueDate);
    cy.get("[data-cy='location-input-text']").type(location);
    cy.get("[data-cy='submit']").click();

    cy.get("[data-cy='todo-item-wrapper']")
      .contains(text)
      .parent()
      .within(() => {
        cy.get("[data-cy='todo-item-update']").click();
      });
      
    cy.get("[data-cy='input-text']").clear().type(textUpdated);
    cy.get("[data-cy='due-date-input-text']").clear().type(dueDate);
    cy.get("[data-cy='location-input-text']").clear().type(locationUpdated);
    cy.get("[data-cy='submit']").click();
    
    cy.contains(textUpdated);
    cy.contains(locationUpdated);

    cy.contains(text).should("not.exist");
    cy.contains(location).should("not.exist");
  });
});
