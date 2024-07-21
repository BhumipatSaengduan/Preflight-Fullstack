before(() => {
  const url = Cypress.env("BACKEND_URL");
  cy.request({
    method: "POST",
    url: `${url}/todo/all`,
  });
});

describe("Backend", () => {
  it("checks env", () => {
    cy.log(JSON.stringify(Cypress.env()));
  });

  it("checks CORS disabled", () => {
    const url = Cypress.env("BACKEND_URL");
    cy.request({
      method: "GET",
      url: `${url}/todo`,
    }).then((res) => {
      // cy.log(JSON.stringify(res));
      expect(res.headers).to.not.have.property("access-control-allow-origin");
    });
  });

  it("checks get response", () => {
    const url = Cypress.env("BACKEND_URL");
    cy.request({
      method: "GET",
      url: `${url}/todo`,
    }).then((res) => {
      expect(res.body).to.be.a("array");
    });
  });

  it("creates todo", () => {
    const url = Cypress.env("BACKEND_URL");
    cy.request({
      method: "PUT",
      url: `${url}/todo`,
      body: {
        todoText: "New Todo",
        dueDate: "2024-12-31",
        location: "Location A",
      },
    }).then((res) => {
      cy.log(JSON.stringify(res.body));
      expect(res.body).to.have.all.keys("msg", "data");
      expect(res.body.data).to.all.keys("id", "todoText", "dueDate", "location");
    });
  });

  it("deletes todo", () => {
    const url = Cypress.env("BACKEND_URL");

    cy.request({
      method: "PUT",
      url: `${url}/todo`,
      body: {
        todoText: "New Todo",
        dueDate: "2024-12-31",
        location: "Location A",
      },
    }).then((res) => {
      const todo = res.body.data;
      cy.request({
        method: "DELETE",
        url: `${url}/todo`,
        body: {
          id: todo.id,
        },
      }).then((res) => {
        cy.log(JSON.stringify(res.body));
        expect(res.body).to.have.all.keys("msg", "data");
        expect(res.body.data).to.all.keys("id");
      });
    });
  });

  it("updates todo", () => {
    const url = Cypress.env("BACKEND_URL");

    cy.request({
      method: "PUT",
      url: `${url}/todo`,
      body: {
        todoText: "New Todo",
        dueDate: "2024-12-31",
        location: "Location B",
      },
    }).then((res) => {
      const todo = res.body.data;
      cy.wrap(todo.id).as("currentId"); // Storing id for using later in the chain
      cy.request({
        method: "PATCH",
        url: `${url}/todo`,
        body: {
          id: todo.id,
          todoText: "Updated Text",
          dueDate: "2025-01-01",
          location: "Location Z",
        },
      }).then((res) => {
        cy.request({
          method: "GET",
          url: `${url}/todo`,
        }).then(function (res) {
          // Notice that arrow function is not used here due to "this" issue
          const currentId = this.currentId; // Get value from context
          const todos = res.body;
          const todo = todos.find((el) => el.id === currentId);
          expect(todo.todoText).to.equal("Updated Text");
          expect(todo.dueDate).to.equal("2025-01-01");
          expect(todo.location).to.equal("Location Z");
        });
      });
    });
  });
});
