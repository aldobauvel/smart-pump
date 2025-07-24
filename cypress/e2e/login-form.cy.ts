describe('Functional UI Test - Login Form', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/login'); // Asegúrate de tener esta ruta
  });

  it('should show validation errors when fields are empty', () => {
    cy.get('[formControlName="email"]').focus().blur();
    cy.get('[formControlName="password"]').focus().blur();

    cy.get('mat-error').should('exist').and('contain', ''); // O verifica un mensaje específico si `errorMessage` lo muestra
      

    cy.get('button[type="submit"]').should('be.disabled'); // Si tienes un botón deshabilitado por validación
  });

  it('should accept valid email and password and hide errors', () => {
    cy.get('[formControlName="email"]').type('aldo@example.com');
    cy.get('[formControlName="password"]').type('123456');

    cy.get('mat-error').should('not.exist');
    // Puedes verificar si el formulario está listo para enviarse
    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('should submit the form if valid', () => {
    cy.get('[formControlName="email"]').type('aldo@example.com');
    cy.get('[formControlName="password"]').type('123456');

    cy.get('button[type="submit"]').click();
    
  });
});
