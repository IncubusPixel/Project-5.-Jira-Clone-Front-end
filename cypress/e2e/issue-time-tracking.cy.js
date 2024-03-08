describe("Time Logging functionality", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });

  const getIssueDetailsModal = () =>cy.get('[data-testid="modal:issue-details"]');
  const getIssueCreate = () => cy.get('[data-testid="modal:issue-create"]');
  const bugDescription ="What is a man? A miserable little pile of secrets. But enough talk, HAVE AT YOU!";
  const shortSummary = "Die, monster! You don't belong in this world!";
  const closeButton = () => cy.get('[data-testid="icon:close"]').click();
  const stopWatch = () => cy.get('[data-testid="icon:stopwatch"]');
  const estimateTime = () => cy.get('input[placeholder="Number"]');
  const firstIssueClick = () =>cy.get('[data-testid="list-issue"]').eq(0).click();
  const timeTrackingWindow = () => cy.get('[data-testid="modal:tracking"]');
  const timeTrackingNumber = () => cy.get('input[placeholder="Number"]');

  it("Creating Issue, Add estimation, Update estimation, Remove estimation", () => {
    cy.wait(3000);
    getIssueCreate().within(() => {
      cy.get(".ql-editor").type(bugDescription);
      cy.get(".ql-editor").should("have.text", bugDescription);
      cy.get('input[name="title"]').type(shortSummary);
      cy.get('input[name="title"]').should("have.value", shortSummary);
      cy.get('button[type="submit"]').scrollIntoView().click();
    });
    cy.contains("Issue has been successfully created.").should("be.visible");
    getIssueCreate().should("not.exist");
    cy.reload();
    cy.wait(10000);
    firstIssueClick();
    //Update time estimation
    getIssueDetailsModal()
      .should("be.visible")
      .within(() => {
        cy.wait(10000);
        stopWatch().siblings().should("have.text", "No time logged");
        estimateTime().click().type("10");
        cy.wait(3000);
        closeButton();
        getIssueDetailsModal().should("not.exist");
      });
    firstIssueClick();
    getIssueDetailsModal()
      .should("be.visible")
      .within(() => {
        estimateTime().should("have.value", "10");
        stopWatch().next().should("contain", "10h estimated");
        //Update time estimation
        estimateTime().clear().click().type("20");
        cy.wait(3000);
        closeButton();
        getIssueDetailsModal().should("not.exist");
      });
    firstIssueClick();
    getIssueDetailsModal()
      .should("be.visible")
      .within(() => {
        estimateTime().should("have.value", "20");
        stopWatch().next().should("contain", "20h estimated");
        //Remove time estimation
        estimateTime().click().clear();
        cy.wait(3000);
        closeButton();
        getIssueDetailsModal().should("not.exist");
      });
    firstIssueClick();
    getIssueDetailsModal()
      .should("be.visible")
      .within(() => {
        cy.get("input").should("have.attr", "placeholder", "Number");
      });
  });
  it("Creating Issue, log time, remove logged time", () => {
    cy.wait(3000);
    getIssueCreate().within(() => {
      cy.get(".ql-editor").type(bugDescription);
      cy.get(".ql-editor").should("have.text", bugDescription);
      cy.get('input[name="title"]').type(shortSummary);
      cy.get('input[name="title"]').should("have.value", shortSummary);
      cy.get('button[type="submit"]').scrollIntoView().click();
    });
    cy.contains("Issue has been successfully created.").should("be.visible");
    getIssueCreate().should("not.exist");
    cy.reload();
    cy.wait(10000);
    firstIssueClick();
    //Update time estimation and add time tracking
    getIssueDetailsModal()
      .should("be.visible")
      .within(() => {
        cy.wait(10000);
        stopWatch().siblings().should("have.text", "No time logged");
        estimateTime().click().type("10");
        cy.wait(3000);
        stopWatch().click();
      });
    timeTrackingWindow()
      .should("be.visible")
      .within(() => {
        cy.contains("Time spent (hours)");
        timeTrackingNumber().first().type("2");
        timeTrackingNumber().last().type("5");
        cy.contains("Done").click();
      });
    getIssueDetailsModal().within(() => {
      stopWatch().siblings().should("not.have.text", "No time logged");
      cy.contains("div", "2h logged").should("be.visible");
      cy.contains("div", "5h remaining").should("be.visible");
      //Removing logged time
      stopWatch().click();
    });
    timeTrackingWindow()
      .should("be.visible")
      .within(() => {
        cy.contains("Time spent (hours)");
        timeTrackingNumber().first().clear();
        timeTrackingNumber().last().clear();
        cy.contains("Done").click();
      });
    getIssueDetailsModal().within(() => {
      stopWatch().siblings().first().should("contain", "No time logged");
      estimateTime().should("have.value", "10");
      stopWatch().siblings().last().should("contain", "10h estimated");
    });
  });
});
