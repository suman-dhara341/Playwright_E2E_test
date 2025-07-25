import { test, expect } from "@playwright/test";
import { EnvConfigPlaywright } from "../envConfig";

test("Badge Page", async ({ page, request }) => {
  await page.addInitScript(() => {
    localStorage.setItem("feedTour", "true");
    localStorage.setItem("badgesTour", "true");
    localStorage.setItem("badgesDetailsTour", "true");
  });

  const API_BASE_URL = EnvConfigPlaywright.apiUrl;
  const USER_BASE_URL = EnvConfigPlaywright.userUrl;
  const email = "tokivi7552@baxima.com";
  const password = "Sum@n123";

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid =
    password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);

  if (!isEmailValid || !isPasswordValid) {
    console.error(
      `Input validation failed. Email: ${email}, Password: [HIDDEN]`
    );
    throw new Error("Input validation failed: Invalid email or weak password.");
  }

  try {
    await page.goto(`${USER_BASE_URL}/login`);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    const loginAPIResp = await request.post(`${API_BASE_URL}/auth/signin`, {
      data: { email, password },
      headers: { "Content-Type": "application/json" },
    });
    const loginResponse = await loginAPIResp.json();
    if (loginResponse.status !== 200) {
      console.error("Login API error:", loginResponse);
      throw new Error(
        "Login failed: " + JSON.stringify(loginResponse, null, 2)
      );
    }
    expect(loginResponse.message).toBe("Login success!");
    await expect(page).toHaveURL(`${USER_BASE_URL}/feed`, { timeout: 10000 });

    await page.locator("#menu-item").getByRole("button").click();
    await page.getByRole("link", { name: /badges/i }).click();
    await expect(page).toHaveURL(`${USER_BASE_URL}/badges`);

    const USER_DATA = await page.evaluate(() => {
      try {
        const persistedAuth = localStorage.getItem("persist:auth");
        if (!persistedAuth) return { orgId: "", empId: "" };
        const parsedAuth = JSON.parse(persistedAuth);
        const userData = JSON.parse(parsedAuth.userData);
        return {
          orgId: userData["custom:orgId"] ?? "",
          empId: userData["custom:empId"] ?? "",
        };
      } catch {
        return { orgId: "", empId: "" };
      }
    });

    const badgeApi = await request.get(
      `${API_BASE_URL}/badge?maxResults=24&&orgId=${USER_DATA.orgId}`,
      {
        headers: {
          authorization: `Bearer ${loginResponse.data.idToken}`,
        },
      }
    );
    const allBadge = await badgeApi.json();

    if (allBadge.message === "Unauthorized") {
      console.error("Badge list fetch failed:", allBadge);
      throw new Error("Unauthorized access to badges data.");
    }
    expect(allBadge.message).toBe("Data fetched successfully!");
    expect(allBadge.status).toBe(200);

    if (allBadge?.data && allBadge?.data.length > 0) {
      try {
        await expect(page.locator("#badge_select")).toBeVisible({
          timeout: 10000,
        });
        await page.locator("#badge_select").click();

        const detailsAPIResp = await request.get(
          `${API_BASE_URL}/badge/Custom/${allBadge?.data[0]?.category}?orgId=${USER_DATA.orgId}`,
          {
            headers: {
              authorization: `Bearer ${loginResponse.data.idToken}`,
            },
          }
        );

        const badgeDetails = await detailsAPIResp.json();

        let uiBadgeName: string | null = null;
        try {
          await page
            .locator("#badge_name")
            .waitFor({ state: "visible", timeout: 10000 });
          uiBadgeName = await page.locator("#badge_name").textContent();
        } catch (e) {
          await page.screenshot({
            path: "badge_name-not-found.png",
            fullPage: true,
          });
          throw new Error(
            "The badge name element (#badge_name) was not rendered on the Badges page. See badge_name-not-found.png for a screenshot."
          );
        }

        if (
          !badgeDetails.data ||
          typeof badgeDetails.data.name === "undefined"
        ) {
          await page.screenshot({
            path: "badgeDetails-name-missing.png",
            fullPage: true,
          });
          throw new Error(
            `The badge details API did not return a 'name' field. API response: ${JSON.stringify(
              badgeDetails.data
            )}. See badgeDetails-name-missing.png for the UI state.`
          );
        }

        if (badgeDetails.data.name?.trim() !== uiBadgeName?.trim()) {
          await page.screenshot({
            path: "badge_name-mismatch.png",
            fullPage: true,
          });
          throw new Error(
            [
              "Mismatch between badge name from API and UI badge name.",
              `UI badge name    : "${uiBadgeName}"`,
              `API badge name: "${badgeDetails.data.name}"`,
              "See badge_name-mismatch.png for details.",
            ].join("\n")
          );
        }

        expect(badgeDetails.data.name?.trim()).toBe(uiBadgeName?.trim());

        await page.goBack();
      } catch (error) {
        console.error("Badge details interaction failed:", error);
        await page.goBack();
        throw error;
      }
    }
  } catch (err) {
    await page.screenshot({
      path: "badge-test-unexpected-error.png",
      fullPage: true,
    });
    console.error("Test failed with error:", err.message || err);
    throw err;
  }
});
