import { test, expect } from "@playwright/test";
import { EnvConfig } from "../../src/config/config";

test("Award Page", async ({ page, request }) => {
  await page.addInitScript(() => {
    localStorage.setItem("feedTour", "true");
    localStorage.setItem("awardTour", "true");
    localStorage.setItem("awardDetailsTour", "true");
  });
  const awardName: string = "Award for Excellence";
  const description: string = "Awarded for outstanding performance.";
  const criteria: string = "Met all quarterly goals and helped peers.";

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

  // award page
  await page.locator("#menu-item").getByRole("button").click();
  await page.getByRole("link", { name: "awards Earn awards to" }).click();
  await expect(page).toHaveURL(`${USER_BASE_URL}/awards`);

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

  const awardResponse = await request.get(
    `${API_BASE_URL}/org/${USER_DATA.orgId}/award?maxResults=24`,
    {
      headers: {
        authorization: `Bearer ${loginResponse.data.idToken}`,
      },
    }
  );

  const allAward = await awardResponse.json();

  if (allAward.message === "Unauthorized") {
    throw new Error("Unauthorized access to awards data.");
  }
  expect(allAward.message).toBe("Data fetched successfully!");
  expect(allAward.status).toBe(200);

  if (allAward.data.length > 0) {
    await expect(page.locator("#award_select")).toBeVisible({ timeout: 10000 });
    await page.locator("#award_select").click();

    const awardDetails = await request.get(
      `${API_BASE_URL}/org/${USER_DATA.orgId}/award/${allAward.data[0].awardId}?employeeId=${USER_DATA.empId}`,
      {
        headers: {
          authorization: `Bearer ${loginResponse.data.idToken}`,
        },
      }
    );
    const awardDetailsData = await awardDetails.json();

    await page
      .locator("#award_details_name")
      .waitFor({ state: "visible", timeout: 10000 });
    const uiManagerName = await page
      .locator("#award_details_name")
      .textContent();

    await expect(awardDetailsData.data.awardName).toBe(uiManagerName);
    await expect(awardDetailsData.status).toBe(200);
    await page.goBack();
  }

  //   await page.locator("#filter-award-button").click();
  //   await page.getByText("My Awards").click();

  //   console.log(
  //     `${API_BASE_URL}/org/${USER_DATA.orgId}/award/byModerator/${USER_DATA.empId}&maxResults=24`
  //   );

  //   const MyAwardsApiResponse = await request.get(
  //     `${API_BASE_URL}/org/${USER_DATA.orgId}/award/byModerator/${USER_DATA.empId}&maxResults=24`
  //   );

  //   console.log(await MyAwardsApiResponse.json());

  // Award create section
  await page.locator("#create-award-button").click();

  await page.fill('input[name="awardName"]', awardName);
  await page.fill('textarea[name="description"]', description);
  await page.locator(".ql-editor").fill(criteria);
  await page.locator("#file").click();
  await page.setInputFiles('input[type="file"]', "public/images/fav_icon.png");

  const cropButton = page.locator('button:has-text("Crop")');
  if (await cropButton.isVisible({ timeout: 8000 })) {
    await cropButton.click();
  }

  const awardNameValue = await page
    .locator('input[name="awardName"]')
    .inputValue();
  const descriptionValue = await page
    .locator('textarea[name="description"]')
    .inputValue();
  const criteriaValue = await page.locator(".ql-editor").textContent();

  if (!awardNameValue?.trim()) {
    throw new Error(
      "Input validation failed: Award Name field is empty or not filled"
    );
  }
  if (!descriptionValue?.trim()) {
    throw new Error(
      "Input validation failed: Description field is empty or not filled"
    );
  }
  if (!criteriaValue?.trim()) {
    throw new Error(
      "Input validation failed: Criteria field is empty or not filled"
    );
  }

  const responsePromise = page.waitForResponse((response) => {
    return (
      response.url().includes(`/org/${USER_DATA.orgId}/award`) &&
      response.request().method() === "POST"
    );
  });

  await page.locator("#publish_award_button").click();
  await expect(page).toHaveURL(`${USER_BASE_URL}/awards`);
  const responseData = await responsePromise;

  const body = await responseData.json();
  expect(body.status).toBe(201);
  expect(body.message).toBe("Data created successfully!");
});
