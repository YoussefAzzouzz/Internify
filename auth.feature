Feature: User registration
  Users should be able to create an account with valid information.

  Scenario: Successful registration
    When a new user registers with valid details
    Then the system should confirm successful registration

  Scenario: Registration fails for duplicate username
    Given an existing username
    When a user tries to register with that username
    Then the system should reject the registration with a username error

  Scenario: Registration fails for duplicate email
    Given an existing email address
    When a user tries to register with that email
    Then the system should reject the registration with an email error




  # ==================== SUCCESSFUL AUTHENTICATION ====================
  
  Scenario: Successful sign in with valid credentials
    When a user attempts to sign in with valid credentials
    Then the response status should be 200
    And a JWT token should be returned
    And the response should include user id, username, email, roles, verification status, and phone number

  # ==================== FAILED AUTHENTICATION ====================

  Scenario: Failed sign in with invalid password
    When a user attempts to sign in with an incorrect password
    Then the authentication should fail
    And an authentication error message should be returned

  Scenario: Failed sign in with non-existent username
    When a sign in attempt is made with a username that does not exist
    Then the authentication should fail
    And an error message should be returned

  Scenario: Failed sign in with empty credentials
    When a sign in attempt is made with empty username or password
    Then a validation error message should be returned


