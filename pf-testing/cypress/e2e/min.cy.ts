import { zeroPad } from "../../utils";

describe("template spec", () => {
  it("passes", () => {
    cy.visit("https://example.cypress.io");
  });
});

describe("Backend", () => {
  it("checks get response", () => {
    const url = "http://localhost:3000";
    cy.request({
      method: "GET",
      url: `${url}/todo`,
    }).then((res) => {
      expect(res.body).to.be.a("array");
    });
  });
});

describe("Frontend", () => {
  it("creates todo", () => {
    const url = "http://localhost:5173";
    const now = new Date()

    const text = now.getTime().toString();
    const dueDate = `${now.getFullYear()}-${zeroPad(now.getMonth())}-${zeroPad(now.getDate())}`;
    const location = "Location M"

    cy.visit(url);
    cy.get("[data-cy='input-text']").type(text);
    cy.get("[data-cy='due-date-input-text']").type(dueDate);
    cy.get("[data-cy='location-input-text']").type(location);
    cy.get("[data-cy='submit']").click();
    cy.contains(text);
    cy.contains(location);
  });
});
