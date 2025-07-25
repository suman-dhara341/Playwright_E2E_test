import { test, expect } from "@playwright/test";
import { EnvConfigPlaywright, testCredentials } from "../envConfig";

test("user can login successfully", async ({ page, request }) => {
  const API_BASE_URL = EnvConfigPlaywright.apiUrl;
  const USER_BASE_URL = EnvConfigPlaywright.userUrl;
  const email = testCredentials.email;
  const password = testCredentials.password;

  await page.goto(`${USER_BASE_URL}/login`);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid =
    password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);

  if (!isEmailValid || !isPasswordValid) {
    console.error(
      `Input validation failed: Email - ${email}, Password - [HIDDEN]`
    );
    throw new Error("Input validation failed: Invalid email or weak password.");
  }

  const response = await request.post(`${API_BASE_URL}/auth/signin`, {
    data: { email, password },
    headers: { "Content-Type": "application/json" },
  });
  const loginResponse = await response.json();

  if (loginResponse.status !== 200) {
    console.error("API login failed", loginResponse);
    throw new Error(
      `Login failed - API response: ${JSON.stringify(loginResponse)}`
    );
  }
  expect(loginResponse.message).toBe("Login success!");
  await expect(page).toHaveURL(`${USER_BASE_URL}/feed`, { timeout: 10000 });
});
