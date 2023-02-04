describe('template spec', () => {
  it("frontend works", () => {
    cy.visit("http://localhost:4173/");
    cy.contains("Hello World!");
  })
  it("backend works", () => {
    cy.visit("http://localhost:4173/")
    cy.contains("The Awakening by Kate Chopin");
    cy.contains("City of Glass by Paul Auster");
  })
})