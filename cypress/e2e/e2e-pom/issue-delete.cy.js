describe('Test Case 1: Issue Deletion', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
            cy.visit(url + '/board');
            // Open the first issue from the board
            cy.contains('This is an issue of type: Task.').click();
        });
    });

    it('Should open the issue detail view modal and delete it successfully', () => {
        // Assert the visibility of the issue detail view modal
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');

        // Click on the delete button within the issue detail view modal
        cy.get('[data-testid="icon:trash"]').click();

        // Wait for the confirmation modal to be visible
        cy.get('[data-testid="modal:confirm"]', { timeout: 10000 }).should('be.visible');

        // Click on the 'Delete issue' button within the confirmation modal
        cy.contains('Delete issue').click();
        cy.wait(10000)
        cy.get('[data-testid="modal:confirm"]', { timeout: 10000 }).should('not.exist');
        cy.get('[data-testid="modal:issue-details"]').should('not.exist');
        cy.contains('This is an issue of type: Task.').should('not.exist');
    });
});

describe('Test Case 2: Issue Deletion Cancellation', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
            cy.visit(url + '/board');
            // Open the first issue from the board
            cy.contains('This is an issue of type: Task.').click();
        });
    });
    it('Should open the issue detail view modal and cancel deletion successfully', () => {
        // Assert the visibility of the issue detail view modal
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');

        // Click on the delete button within the issue detail view modal
        cy.get('[data-testid="icon:trash"]').click();

        // Wait for the confirmation modal to be visible
        cy.get('[data-testid="modal:confirm"]', { timeout: 10000 }).should('be.visible');
        cy.contains('Cancel').click();
        cy.wait(10000)
        cy.get('[data-testid="modal:confirm"]', { timeout: 10000 }).should('not.exist');
        cy.contains('This is an issue of type: Task.').should('be.visible');
    });
});