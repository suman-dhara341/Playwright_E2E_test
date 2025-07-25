import { test, expect } from "@playwright/test";
import { EnvConfig } from "../../src/config/config";

test("Feed page", async ({ page, request }) => {
  await page.addInitScript(() => {
    localStorage.setItem("feedTour", "true");
    localStorage.setItem("profileTour", "true");
  });

  const API_BASE_URL = EnvConfig.apiUrl;
  const USER_BASE_URL = EnvConfig.userUrl;
  const email = "tokivi7552@baxima.com";
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

  // user profile
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
      return {
        orgId: "",
        empId: "",
      };
    }
  });

  const profileRES = await request.get(
    `${API_BASE_URL}/org/${USER_DATA.orgId}/employee/${USER_DATA.empId}`,
    {
      headers: {
        authorization: `Bearer ${loginResponse.data.idToken}`,
      },
    }
  );
  const profileData = await profileRES.json();
  if (profileData.message === "Unauthorized") {
    throw new Error("Unauthorized access to profile data.");
  }

  expect(profileData.status).toBe(200);
  expect(profileData.message).toBe("Data fetched successfully!");

  // profile page View
  await page.click("#employee_name");
  await page.locator("#award").waitFor({
    state: "visible",
    timeout: 10000,
  });
  await page.locator("#badges").waitFor({ state: "visible", timeout: 10000 });
  await page.locator("#journey").waitFor({ state: "visible", timeout: 10000 });
  await page.locator("#journey").waitFor({ state: "visible", timeout: 10000 });
  await page.goBack();
  await page.click("#awards");
  await page
    .locator("#totalAwardsReceived")
    .waitFor({ state: "visible", timeout: 10000 });

  await page.goBack();
  await page.click("#badges");

  await page
    .locator("#totalBadgesReceived")
    .waitFor({ state: "visible", timeout: 10000 });

  await page.goBack();
  const managerName = await page.locator("#reportsTo").textContent();

  await page.click("#reportsTo");
  const uiManagerName = await page.locator("#profile_name").textContent();

  await expect(uiManagerName?.trim()).toBe(managerName);

  await page.goBack();
  await expect(page).toHaveURL(`${USER_BASE_URL}/feed`);

  // giveRecognition section this code is perfectly working
  // await page.click("#giveRecognition");

  // await page
  //   .locator('input[placeholder="Search Custom Badge..."]')
  //   .waitFor({ state: "visible" });

  // await page.fill(
  //   'input[placeholder="Search Custom Badge..."]',
  //   "Best Quality"
  // );

  // await page.click("#badge_select");
  // await page.fill('input[placeholder="Search an employee"]', "Souvik Roy");

  // await page.getByRole("option", { name: "Souvik Roy" }).first().waitFor();
  // await page.getByRole("option", { name: "Souvik Roy" }).first().click();

  // await page.fill(
  //   'input[placeholder="Search and tag employees"]',
  //   "Soumik Nayak"
  // );
  // await page.getByRole("option", { name: "Soumik Nayak" }).first().waitFor();
  // await page.getByRole("option", { name: "Soumik Nayak" }).first().click();
  // await page.fill("#recognition_details_content", "Best Quality");

  // const responsePromise = page.waitForResponse((response) => {
  //   return (
  //     response.url().includes(`/org/${USER_DATA.orgId}/recognition`) &&
  //     response.request().method() === "POST"
  //   );
  // });

  // await page.click("#giveRecognition_submit");

  // const responseData = await responsePromise;
  // const body = await responseData.json();
  // await expect(body.status).toBe(201);
  // await expect(body.message).toBe("Recognition saved success!");

  const feedResponse = await request.get(
    `${API_BASE_URL}/org/${USER_DATA.orgId}/feed?employeeId=${USER_DATA.empId}&maxResults=3`,
    {
      headers: {
        authorization: `Bearer ${loginResponse.data.idToken}`,
      },
    }
  );

  const feedData = await feedResponse.json();

  // Validate feed response
  if (feedData.message === "Unauthorized") {
    throw new Error("Unauthorized access to feed data.");
  }

  expect(feedData.status).toBe(200);
  expect(feedData.message).toBe("Feeds fetched successfully!");

  if (feedData.data.length > 0) {
    if (feedData.data[0].isLike === false) {
      await page.click("#feed_like_button");
    }
    await page.click("#feed_like_modal");
    await page.locator("#like_list_modal_close path").nth(1).click();

    await page
      .locator('input[name="commentContent"][placeholder="Add a comment..."]')
      .first()
      .waitFor({ state: "visible" });
    await page.fill(
      'input[name="commentContent"][placeholder="Add a comment..."]',
      "well done."
    );
    await page
      .locator('input[name="commentContent"][placeholder="Add a comment..."]')
      .first()
      .waitFor({ state: "visible", timeout: 10000 });

    await page
      .locator('input[name="commentContent"][placeholder="Add a comment..."]')
      .first()
      .type("well done.");

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

  // Activity Section
  await page.click("#viewAllActivity");
  await page.locator("#Activity").waitFor({
    state: "visible",
    timeout: 10000,
  });

  await page.goBack();

  const activityResponse = await request.get(
    `${EnvConfig.apiUrl}/org/${USER_DATA.orgId}/notification/activity?userId=${USER_DATA.empId}&maxResults=20`,
    {
      headers: {
        authorization: `Bearer ${loginResponse.data.idToken}`,
      },
    }
  );

  const activityData = await activityResponse.json();
  if (activityData.message === "Unauthorized") {
    throw new Error("Unauthorized access to activity data.");
  }
  await expect(activityData.status).toBe(200);
  await expect(activityData.message).toBe("Activity successfully retrieved!");

  if (activityData.data.length > 0) {
    const firstActivity = activityData.data[0].notificationId;
    const domId = await page.locator("li").first().getAttribute("id");
    expect(domId).toBe(firstActivity);
  }
});
