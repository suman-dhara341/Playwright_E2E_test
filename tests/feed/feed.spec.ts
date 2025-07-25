import { test, expect } from "@playwright/test";
import { EnvConfigPlaywright } from "../envConfig";

test("Feed page", async ({ page, request }) => {
  await page.addInitScript(() => {
    localStorage.setItem("feedTour", "true");
    localStorage.setItem("profileTour", "true");
  });

  const API_BASE_URL = EnvConfigPlaywright.apiUrl;
  const USER_BASE_URL = EnvConfigPlaywright.userUrl;
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  // --- Input validation ---
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email ?? "");
  const isPasswordValid =
    typeof password === "string" &&
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /\d/.test(password);

  if (!isEmailValid || !isPasswordValid) {
    console.error(`Input validation failed. Email: ${email}`);
    throw new Error("Input validation failed: Invalid email or weak password.");
  }

  try {
    // 1. Login (UI and API)
    await page.goto(`${USER_BASE_URL}/login`);
    await page.fill('input[name="email"]', email!);
    await page.fill('input[name="password"]', password!);
    await page.click('button[type="submit"]');

    const response = await request.post(`${API_BASE_URL}/auth/signin`, {
      data: { email, password },
      headers: { "Content-Type": "application/json" },
    });
    const loginResponse = await response.json();

    if (loginResponse.status !== 200) {
      console.error("Login API failed:", loginResponse);
      throw new Error(
        "Login failed: " + JSON.stringify(loginResponse, null, 2)
      );
    }

    expect(loginResponse.message).toBe("Login success!");
    await expect(page).toHaveURL(`${USER_BASE_URL}/feed`);

    // 2. Fetch user/org info
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
      } catch (e) {
        return { orgId: "", empId: "" };
      }
    });

    if (!USER_DATA.orgId || !USER_DATA.empId) {
      await page.screenshot({ path: "test-results/feed-missing-userdata.png" });
      console.error("Missing orgId/empId from localStorage:", USER_DATA);
      throw new Error("Could not extract orgId/empId; possible auth issue.");
    }

    // 3. Verify profile
    const profileRES = await request.get(
      `${API_BASE_URL}/org/${USER_DATA.orgId}/employee/${USER_DATA.empId}`,
      {
        headers: { authorization: `Bearer ${loginResponse.data.idToken}` },
      }
    );
    const profileData = await profileRES.json();
    if (profileData.message === "Unauthorized") {
      await page.screenshot({
        path: "test-results/feed-profile-unauthorized.png",
      });
      console.error("Profile data fetch unauthorized:", profileData);
      throw new Error("Unauthorized access to profile data.");
    }

    expect(profileData.status).toBe(200);
    expect(profileData.message).toBe("Data fetched successfully!");

    // 4. Profile page navigation/validation
    await page.click("#employee_name");
    await page.locator("#award").waitFor({ state: "visible", timeout: 10000 });
    await page.locator("#badges").waitFor({ state: "visible", timeout: 10000 });
    await page
      .locator("#journey")
      .waitFor({ state: "visible", timeout: 10000 });
    await page.goBack();

    // Awards tab
    await page.click("#awards");
    await page
      .locator("#totalAwardsReceived")
      .waitFor({ state: "visible", timeout: 10000 });
    await page.goBack();

    // Badges tab
    await page.click("#badges");
    await page
      .locator("#totalBadgesReceived")
      .waitFor({ state: "visible", timeout: 10000 });
    await page.goBack();

    // Reports To/Manager check
    const managerName = await page.locator("#reportsTo").textContent();
    await page.click("#reportsTo");
    const uiManagerName = await page.locator("#profile_name").textContent();
    await expect(uiManagerName?.trim()).toBe(managerName);
    await page.goBack();
    await expect(page).toHaveURL(`${USER_BASE_URL}/feed`);

    // 5. Give Recognition flow
    await page.click("#giveRecognition");
    await page
      .locator('input[placeholder="Search Custom Badge..."]')
      .waitFor({ state: "visible" });
    await page.fill(
      'input[placeholder="Search Custom Badge..."]',
      "Best Quality"
    );
    await page.click("#badge_select");
    await page.fill('input[placeholder="Search an employee"]', "Souvik Roy");
    await page.getByRole("option", { name: "Souvik Roy" }).first().waitFor();
    await page.getByRole("option", { name: "Souvik Roy" }).first().click();
    await page.fill(
      'input[placeholder="Search and tag employees"]',
      "Soumik Nayak"
    );
    await page.getByRole("option", { name: "Soumik Nayak" }).first().waitFor();
    await page.getByRole("option", { name: "Soumik Nayak" }).first().click();
    await page.fill("#recognition_details_content", "Best Quality");

    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes(`/org/${USER_DATA.orgId}/recognition`) &&
        response.request().method() === "POST"
    );

    await page.click("#giveRecognition_submit");
    const responseData = await responsePromise;
    const body = await responseData.json();
    if (body.status !== 201) {
      await page.screenshot({ path: "test-results/feed-recognition-fail.png" });
      console.error("Recognition submit failed:", body);
      throw new Error(
        `Recognition failed: Status=${body.status}, Message=${body.message}`
      );
    }
    await expect(body.status).toBe(201);
    await expect(body.message).toBe("Recognition saved success!");

    // 6. Feed data
    const feedResponse = await request.get(
      `${API_BASE_URL}/org/${USER_DATA.orgId}/feed?employeeId=${USER_DATA.empId}&maxResults=3`,
      {
        headers: {
          authorization: `Bearer ${loginResponse.data.idToken}`,
        },
      }
    );
    const feedData = await feedResponse.json();

    if (feedData.message === "Unauthorized") {
      await page.screenshot({
        path: "test-results/feed-feeddata-unauthorized.png",
      });
      console.error("Feed data unauthorized:", feedData);
      throw new Error("Unauthorized access to feed data.");
    }
    expect(feedData.status).toBe(200);
    expect(feedData.message).toBe("Feeds fetched successfully!");

    if (Array.isArray(feedData.data) && feedData.data.length > 0) {
      if (feedData.data[0].isLike === false) {
        await page.click("#feed_like_button");
      }
      await page.click("#feed_like_modal");
      await page.locator("#like_list_modal_close path").nth(1).click();

      const commentInput = page
        .locator('input[name="commentContent"][placeholder="Add a comment..."]')
        .first();
      await commentInput.waitFor({ state: "visible" });
      await commentInput.fill("well done.");
      await commentInput.waitFor({ state: "visible", timeout: 10000 });
      await commentInput.type("well done.");
      await page.locator('button[type="submit"]:has(svg)').first().click();
      await page
        .locator("text=/\\d+ Comments?/")
        .first()
        .waitFor({ state: "visible", timeout: 8000 });
      await page.locator("text=/\\d+ Comments?/").first().click();
      await page
        .locator('text="All Comments"')
        .waitFor({ state: "visible", timeout: 5000 });
      await page.locator("svg.lucide-x").click();
    }

    await page.click("#viewAllActivity");
    await page.locator("#Activity").waitFor({
      state: "visible",
      timeout: 10000,
    });
    await page.goBack();

    const activityResponse = await request.get(
      `${EnvConfigPlaywright.apiUrl}/org/${USER_DATA.orgId}/notification/activity?userId=${USER_DATA.empId}&maxResults=20`,
      {
        headers: { authorization: `Bearer ${loginResponse.data.idToken}` },
      }
    );
    const activityData = await activityResponse.json();

    if (activityData.message === "Unauthorized") {
      await page.screenshot({
        path: "test-results/feed-activity-unauthorized.png",
      });
      console.error("Activity data fetch unauthorized:", activityData);
      throw new Error("Unauthorized access to activity data.");
    }
    await expect(activityData.status).toBe(200);
    await expect(activityData.message).toBe("Activity successfully retrieved!");

    if (Array.isArray(activityData.data) && activityData.data.length > 0) {
      const domIds = await page
        .locator("#activity-list > li")
        .evaluateAll((els) => els.map((e) => e.id));
      const apiIds = activityData.data.map((item: any) => item.notificationId);

      for (const id of domIds) {
        expect(apiIds).toContain(id);
      }
    }
  } catch (err) {
    await page.screenshot({
      path: `test-results/feed-unexpected-error-${Date.now()}.png`,
      fullPage: true,
    });
    console.error("Test failed with error:", err);
    throw err;
  }
});
