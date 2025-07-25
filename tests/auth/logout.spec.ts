import { test, expect } from "@playwright/test";
import { EnvConfig } from "../../src/config/config";

test("user can login and logout successfully", async ({ page, request }) => {
  await page.addInitScript(() => {
    localStorage.setItem("feedTour", "true");
  });

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

  await expect(page).toHaveURL(`${USER_BASE_URL}/feed`);

  await page.locator("#navbar_avatar").click();

  await page.getByRole("button", { name: "Log Out" }).click();

  const fcmToken = await page.evaluate(() => {
    return localStorage.getItem("fcmToken") || "";
  });

  const logoutPayload = {
    authToken: loginResponse.data.idToken,
    email: email,
    fcmToken,
  };

  const logoutResponse = await request.post(`${API_BASE_URL}/auth/signout`, {
    data: logoutPayload,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const logoutData = await logoutResponse.json();
  expect(logoutData.status).toBe(200);
  expect(logoutData.message).toBe("Logout successful.");

  await expect(page).toHaveURL(`${USER_BASE_URL}/login`);

  await page
    .locator("text=Email Address")
    .waitFor({ state: "visible", timeout: 10000 });
  await page
    .locator('label:has-text("Password")')
    .waitFor({ state: "visible", timeout: 10000 });
});
