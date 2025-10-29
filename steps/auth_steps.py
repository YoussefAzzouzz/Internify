from datetime import time
from behave import given, when, then
import requests
import xml.etree.ElementTree as ET

# Base URLs
SIGNUP_URL = "http://localhost:8091/SpringMVC/api/auth/signup"
SIGNIN_URL = "http://localhost:8091/SpringMVC/api/auth/signin"

# ONE test user for all scenarios
TEST_USER = {
    "username": "testuser",
    "email": "test@test.com",
    "password": "123456",
    "role": ["user"],
    "phone": "222333444"
}

# ==================== HELPER FUNCTION ====================
#This function takes an XML response (like from a web API) and converts it into a Python dictionary.like this 
  #  "status": "OK",
  #  "code": "200",
  #  "message": "Success"
#}
def parse_xml_response(response):
    """Parse XML response and return as dictionary"""
    try:
        root = ET.fromstring(response.text)
        result = {}
        for child in root:
            result[child.tag] = child.text
        return result
    except:
        return None

# ==================== SIGNUP STEPS ====================

@given('an existing username')
def step_given_existing_username(context):
    """The testuser should already exist from previous test runs"""
    pass


@given('an existing email address')
def step_given_existing_email(context):
    """The test@test.com should already exist from previous test runs"""
    pass


@when('a new user registers with valid details')
def step_when_register_valid_user(context):
    """Register testuser for the FIRST TIME ONLY"""
    context.response = requests.post(SIGNUP_URL, json=TEST_USER)


@when('a user tries to register with that username')
def step_when_register_duplicate_username(context):
    """Try to register testuser AGAIN (duplicate username)"""
    duplicate_attempt = {
        "username": TEST_USER["username"],
        "email": "different@test.com",
        "password": "123456",
        "role": ["user"],
        "phone": "222333444"
    }
    context.response = requests.post(SIGNUP_URL, json=duplicate_attempt)


@when('a user tries to register with that email')
def step_when_register_duplicate_email(context):
    """Try to register test@test.com AGAIN (duplicate email)"""
    duplicate_attempt = {
        "username": "differentuser",
        "email": TEST_USER["email"],
        "password": "123456",
        "role": ["user"],
        "phone": "222333444"
    }
    context.response = requests.post(SIGNUP_URL, json=duplicate_attempt)


@then('the system should confirm successful registration')
def step_then_success(context):
    assert context.response.status_code == 200, \
        f"Expected 200 but got {context.response.status_code}: {context.response.text}"
    assert "User registered successfully" in context.response.text, \
        f"Success message not found in response: {context.response.text}"


@then('the system should reject the registration with a username error')
def step_then_username_error(context):
    assert context.response.status_code == 400, \
        f"Expected 400 but got {context.response.status_code}: {context.response.text}"
    assert "Username is already taken" in context.response.text, \
        f"Username error not found. Response: {context.response.text}"


@then('the system should reject the registration with an email error')
def step_then_email_error(context):
    assert context.response.status_code == 400, \
        f"Expected 400 but got {context.response.status_code}: {context.response.text}"
    assert "Email is already in use" in context.response.text, \
        f"Email error not found. Response: {context.response.text}"


# ==================== SIGNIN STEPS ====================

@when('a user attempts to sign in with valid credentials')
def step_when_signin_valid(context):
    """Sign in with correct username and password"""
    signin_data = {
        "username": TEST_USER["username"],
        "password": TEST_USER["password"]
    }
    context.response = requests.post(SIGNIN_URL, json=signin_data)


@when('a user attempts to sign in with an incorrect password')
def step_when_signin_invalid_password(context):


    """Sign in with wrong password"""
    signin_data = {
        "username": TEST_USER["username"],
        "password": "wrongpassword123"
    }
    context.response = requests.post(SIGNIN_URL, json=signin_data)


@when('a sign in attempt is made with a username that does not exist')
def step_when_signin_nonexistent_user(context):
    """Sign in with username that doesn't exist"""
    signin_data = {
        "username": "nonexistentuser999",
        "password": "somepassword"
    }
    context.response = requests.post(SIGNIN_URL, json=signin_data)


@when('a sign in attempt is made with empty username or password')
def step_when_signin_empty_credentials(context):
    """Sign in with empty credentials"""
    signin_data = {
        "username": "",
        "password": ""
    }
    context.response = requests.post(SIGNIN_URL, json=signin_data)



@then('the response status should be 200')
def step_then_status_200(context):
    assert context.response.status_code == 200, \
        f"Expected 200 but got {context.response.status_code}: {context.response.text}"


@then('a JWT token should be returned')
def step_then_jwt_returned(context):
    # Try JSON first
    try:
        response_json = context.response.json()
        assert "accessToken" in response_json or "token" in response_json or "jwt" in response_json, \
            f"JWT token not found in JSON response: {response_json}"
        context.jwt_token = response_json.get("accessToken") or response_json.get("token") or response_json.get("jwt")
    except:
        # If JSON fails, try XML
        parsed = parse_xml_response(context.response)
        assert parsed is not None, "Could not parse response as JSON or XML"
        assert "accessToken" in parsed, f"JWT token not found in XML response: {parsed}"
        context.jwt_token = parsed["accessToken"]


@then('the response should include user id, username, email, roles, verification status, and phone number')
def step_then_user_info_included(context):
    # Try JSON first
    try:
        response_json = context.response.json()
        assert "id" in response_json, "User ID not in response"
        assert "username" in response_json, "Username not in response"
        assert "email" in response_json, "Email not in response"
        assert "roles" in response_json, "Roles not in response"
        assert "isVerified" in response_json or "verified" in response_json, "Verification status not in response"
        assert "phone" in response_json, "Phone not in response"
    except:
        # If JSON fails, try XML
        parsed = parse_xml_response(context.response)
        assert parsed is not None, "Could not parse response"
        assert "id" in parsed, "User ID not in response"
        assert "username" in parsed, "Username not in response"
        assert "email" in parsed, "Email not in response"
        assert "roles" in parsed, "Roles not in response"
        assert "isVerified" in parsed or "verified" in parsed, "Verification status not in response"
        assert "phone" in parsed, "Phone not in response"


@then('the authentication should fail')
def step_then_auth_fail(context):
    assert context.response.status_code in [400, 401, 403], \
        f"Expected error status but got {context.response.status_code}"


@then('an authentication error message should be returned')
def step_then_auth_error_message(context):
    assert context.response.status_code in [401, 403], \
        f"Expected 401 or 403 but got {context.response.status_code}"
    response_text = context.response.text.lower()
    assert any(keyword in response_text for keyword in ["invalid", "incorrect", "unauthorized", "bad credentials"]), \
        f"No authentication error message found in: {context.response.text}"


@then('an error message should be returned')
def step_then_error_message(context):
    assert context.response.status_code >= 400, \
        f"Expected error status but got {context.response.status_code}"
    assert len(context.response.text) > 0, "No error message in response"


@then('a validation error message should be returned')
def step_then_validation_error(context):
    assert context.response.status_code == 400, \
        f"Expected 400 but got {context.response.status_code}"
    response_text = context.response.text.lower()
    assert any(keyword in response_text for keyword in ["required", "empty", "invalid", "validation"]), \
        f"No validation error found in: {context.response.text}"




