import { test, expect } from "@playwright/test";
import { EnvConfigPlaywright, testCredentials } from "../envConfig";

test("user can login and logout successfully", async ({ page, request }) => {
  await page.addInitScript(() => {
    localStorage.setItem("feedTour", "true");
  });

  const API_BASE_URL = EnvConfigPlaywright.apiUrl;
  const USER_BASE_URL = EnvConfigPlaywright.userUrl;
  const email = testCredentials.email;
  const password = testCredentials.password;

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid =
    password &&
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /\d/.test(password);

  if (!isEmailValid || !isPasswordValid) {
    console.error(`Input validation failed for credentials. Email: ${email}`);
    throw new Error("Input validation failed: Invalid email or weak password.");
  }

  await page.goto(`${USER_BASE_URL}/login`);

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');

  let loginResponse;
  try {
    const response = await request.post(`${API_BASE_URL}/auth/signin`, {
      data: { email, password },
      headers: { "Content-Type": "application/json" },
    });
    loginResponse = await response.json();
  } catch (err) {
    console.error("Network/API call failed during login:", err);
    throw err;
  }

  if (loginResponse.status !== 200) {
    console.error("Login API failed:", loginResponse);
    throw new Error(`Login failed: ${JSON.stringify(loginResponse, null, 2)}`);
  }

  expect(loginResponse.message).toBe("Login success!");
  expect(loginResponse.status).toBe(200);

  await expect(page).toHaveURL(`${USER_BASE_URL}/feed`, { timeout: 10000 });

  // Wait for page to be fully loaded
  await page.waitForLoadState('networkidle');

  // Try multiple selectors for the avatar/profile menu
  const avatarSelectors = [
    "#navbar_avatar",
    "[data-testid='navbar-avatar']", 
    ".navbar-avatar",
    "img[alt*='avatar']",
    "img[alt*='profile']",
    "[data-testid='user-menu']"
  ];

  let avatarClicked = false;
  for (const selector of avatarSelectors) {
    try {
      const avatar = page.locator(selector);
      if (await avatar.isVisible({ timeout: 2000 })) {
        await avatar.click();
        avatarClicked = true;
        break;
      }
    } catch (e) {
      continue;
    }
  }

  if (!avatarClicked) {
    throw new Error("Could not find and click avatar/profile menu");
  }

  // Try multiple selectors for logout button
  const logoutSelectors = [
    'button:has-text("Log Out")',
    'button:has-text("Logout")', 
    'button:has-text("Sign Out")',
    '[data-testid="logout-button"]',
    'a:has-text("Log Out")',
    'a:has-text("Logout")'
  ];

  let logoutClicked = false;
  for (const selector of logoutSelectors) {
    try {
      const logoutBtn = page.locator(selector);
      if (await logoutBtn.isVisible({ timeout: 2000 })) {
        await logoutBtn.click();
        logoutClicked = true;
        break;
      }
    } catch (e) {
      continue;
    }
  }

  if (!logoutClicked) {
    throw new Error("Could not find and click logout button");
  }

  const fcmToken = await page.evaluate(() => {
    return localStorage.getItem("fcmToken") || "";
  });

  let logoutData;
  try {
    const logoutResponse = await request.post(`${API_BASE_URL}/auth/signout`, {
      data: {
        authToken: loginResponse.data.idToken,
        email: email,
        fcmToken,
      },
      headers: { "Content-Type": "application/json" },
    });
    logoutData = await logoutResponse.json();
  } catch (err) {
    console.error("Network/API call failed during logout:", err);
    throw err;
  }

  if (logoutData.status !== 200) {
    console.error("Logout API failed:", logoutData);
    throw new Error(`Logout failed: ${JSON.stringify(logoutData, null, 2)}`);
  }

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
