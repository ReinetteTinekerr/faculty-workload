// Software Engineering 2
// Bardiago Godwin V.
// Santa Monica, Joseph Brendan D.
// Malapit, Paul Ace S.
// Navero, Marvin C.
// Culaeng, Jarenz Dayne L.
// Valeros, Vince Heinezer B.

// First Test case User Login
/*
test 1: Use correct email and password
test 2: Use wrong email and correct password
test 3: Use correct email and wrong password
*/

describe("Login faculty user", () => {
  it("should navigate to the faculty page", () => {
    // Start from the login page
    cy.visit("http://localhost:3000/login");

    const email = "reynaldo@gmail.com";
    const password = "isu123";

    // Find 2 input element with an id of login_email & login_password then type the correct email & password
    // Find 1 submit button with id of login_submit and click it
    cy.get("#login_email").type(email);
    cy.get("#login_password").type(password);
    cy.get("#login_submit").click();

    // The new url should include "/faculty"
    cy.url().should("include", "/faculty");
  });

  it("should not navigate user to faculty page with wrong email", () => {
    cy.visit("http://localhost:3000/login");

    const WRONG_EMAIL = "WRONG_reynaldo@gmail.com";
    const password = "isu123";

    // Find 2 input element with an id of login_email & login_password then type a wrong email &  correct password
    // Find 1 submit button with id of login_submit and click it
    cy.get("#login_email").type(WRONG_EMAIL);
    cy.get("#login_password").type(password);
    cy.get("#login_submit").click();

    // The new url should include "/login"
    cy.url().should("include", "/login");
  });

  it("should not navigate user to faculty page with wrong password", () => {
    cy.visit("http://localhost:3000/login");

    const email = "reynaldo@gmail.com";
    const WRONG_password = "WRONG_isu123";

    // Find 2 input element with an id of login_email & login_password then type a correct email & wrong password
    // Find 1 submit button with id of login_submit and click it
    cy.get("#login_email").type(email);
    cy.get("#login_password").type(WRONG_password);
    cy.get("#login_submit").click();

    // The new url should include "/login"
    cy.url().should("include", "/login");
  });
});
