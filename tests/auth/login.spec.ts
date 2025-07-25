import { test, expect } from "@playwright/test";
import { EnvConfig } from "../../src/config/config";

test("user can login successfully", async ({ page, request }) => {
  const API_BASE_URL = EnvConfig.apiUrl;
  const USER_BASE_URL = EnvConfig.userUrl;
  const email = "sumand3421@gmail.com";
  const password = "Sum@n123";

  await page.goto(`${USER_BASE_URL}/login`);

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid =
    password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);

  if (!isEmailValid || !isPasswordValid) {
    throw new Error("Input validation failed: Invalid email or weak password.");
  }

  const response = await request.post(`${API_BASE_URL}/auth/signin`, {
    data: {
      email: email,
      password: password,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  const loginResponse = await response.json();
  expect(loginResponse.message).toBe("Login success!");
  expect(loginResponse.status).toBe(200);

  await expect(page).toHaveURL(`${USER_BASE_URL}/feed`, { timeout: 10000 });
});
