import { test, expect } from "@playwright/test";
import { EnvConfigPlaywright, testCredentials } from "../envConfig";

test("Award Page", async ({ page, request }) => {
  // Pre-fill onboarding flags in localStorage (for UI onboarding)
  await page.addInitScript(() => {
    localStorage.setItem("feedTour", "true");
    localStorage.setItem("awardTour", "true");
    localStorage.setItem("awardDetailsTour", "true");
  });

  // ---- Test data ----
  const awardName = "Award for Excellence";
  const description = "Awarded for outstanding performance.";
  const criteria = "Met all quarterly goals and helped peers.";

  const API_BASE_URL = EnvConfigPlaywright.apiUrl;
  const USER_BASE_URL = EnvConfigPlaywright.userUrl;
  const email = testCredentials.email;
  const password = testCredentials.password;

  // ---- Input Validation ----
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid =
    password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /\d/.test(password);

  if (!isEmailValid || !isPasswordValid) {
    console.error(
      `Input validation failed. Email: ${email}, Password: [HIDDEN]`
    );
    throw new Error("Input validation failed: Invalid email or weak password.");
  }

  try {
    // ---- Login (UI and API) ----
    await page.goto(`${USER_BASE_URL}/login`);
    await page.fill('input[name="email"]', email!);
    await page.fill('input[name="password"]', password!);
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

    // ---- Go to Awards page ----
    await page.locator("#menu-item").getByRole("button").click();
    await page.getByRole("link", { name: /awards/i }).click();
    await expect(page).toHaveURL(`${USER_BASE_URL}/awards`);

    // ---- Get user/org info from localStorage ----
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

    // ---- List Awards (API) ----
    const awardAPIResp = await request.get(
      `${API_BASE_URL}/org/${USER_DATA.orgId}/award?maxResults=24`,
      {
        headers: {
          authorization: `Bearer ${loginResponse.data.idToken}`,
        },
      }
    );
    const allAward = await awardAPIResp.json();

    if (allAward.message === "Unauthorized") {
      console.error("Award list fetch failed:", allAward);
      throw new Error("Unauthorized access to awards data.");
    }
    expect(allAward.message).toBe("Data fetched successfully!");
    expect(allAward.status).toBe(200);

    if (allAward.data && allAward.data.length > 0) {
      await expect(page.locator("#award_select")).toBeVisible({
        timeout: 10000,
      });
      await page.locator("#award_select").click();

      const detailsAPIResp = await request.get(
        `${API_BASE_URL}/org/${USER_DATA.orgId}/award/${allAward.data[0].awardId}?employeeId=${USER_DATA.empId}`,
        {
          headers: {
            authorization: `Bearer ${loginResponse.data.idToken}`,
          },
        }
      );
      const awardDetails = await detailsAPIResp.json();

      await page
        .locator("#award_details_name")
        .waitFor({ state: "visible", timeout: 10000 });
      const uiManagerName = await page
        .locator("#award_details_name")
        .textContent();

      if (awardDetails.data.awardName !== uiManagerName) {
        console.error(
          `Mismatch: UI='${uiManagerName}', API='${awardDetails.data.awardName}'`
        );
      }
      expect(awardDetails.data.awardName).toBe(uiManagerName);
      expect(awardDetails.status).toBe(200);
      await page.goBack();
    }

    // ---- Start Award creation process ----
    await page.locator("#create-award-button").click();
    await page.fill('input[name="awardName"]', awardName);
    await page.fill('textarea[name="description"]', description);
    await page.locator(".ql-editor").fill(criteria);
    await page.locator("#file").click();
    await page.setInputFiles(
      'input[type="file"]',
      "public/images/fav_icon.png"
    );

    // ---- Handle Crop Modal (if appears) ----
    const cropButton = page.locator('button:has-text("Crop")');
    if (await cropButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await cropButton.click();
      // Wait for the modal/dialog to be detached
      try {
        await page
          .locator('[role="dialog"]')
          .waitFor({ state: "detached", timeout: 8000 });
      } catch {
        console.error("Crop modal did not close after clicking Crop.");
        throw new Error("Crop modal did not close.");
      }
    }

    // ---- Verify all required fields before submission ----
    const awardNameVal = await page
      .locator('input[name="awardName"]')
      .inputValue();
    const descriptionVal = await page
      .locator('textarea[name="description"]')
      .inputValue();
    const criteriaVal = await page.locator(".ql-editor").textContent();

    if (!awardNameVal?.trim()) {
      console.error("Award name is empty before submission.");
      throw new Error("Award Name is required.");
    }
    if (!descriptionVal?.trim()) {
      console.error("Description is empty before submission.");
      throw new Error("Description is required.");
    }
    if (!criteriaVal?.trim()) {
      console.error("Criteria is empty before submission.");
      throw new Error("Criteria is required.");
    }

    // ---- Wait for the Award Creation API call after submission ----
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes(`/org/${USER_DATA.orgId}/award`) &&
        response.request().method() === "POST"
    );

    await page.locator("#publish_award_button").click();
    await expect(page).toHaveURL(`${USER_BASE_URL}/awards`);
    const responseData = await responsePromise;

    const body = await responseData.json();
    if (body.status !== 201) {
      console.error("Award creation failed:", body);
      throw new Error(
        `Award creation failed: Status=${body.status}, Message=${body.message}`
      );
    }
    expect(body.status).toBe(201);
    expect(body.message).toBe("Data created successfully!");
  } catch (err) {
    console.error("Test failed with error:", err);
    throw err;
  }
});
