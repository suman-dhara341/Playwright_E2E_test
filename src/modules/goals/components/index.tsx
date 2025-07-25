import EmployeeGoalCreate from "./EmployeeGoalCreate";
import EmployeeGoals from "./EmployeeGoals";
import { useEffect, useRef, useState } from "react";
import ErrorBoundary from "../../../utilities/ErrorBoundary";
import ErrorFallback from "../../../utilities/ErrorFallback";
import { NavLink } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useGetEmployeeGoalsQuery } from "../queries/okrQuery";
import { useSelector } from "react-redux";

const OKR = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const tourRef = useRef<any>(null);

  const [isDemoMode, setIsDemoMode] = useState(
    localStorage.getItem("goalsTour") !== "true"
  );
  const demoData = {
    data: [
      {
        title: "Complete Onboarding",
        description: "Learn how to use the platform and set your first goal.",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        completionPercentage: 20,
        tags: ["Onboarding", "Training"],
        status: "NOT STARTED",
        isDemoExpanded: true,
      },
    ],
  };

  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );

  const {
    data: employeeGoalsData,
    isError: employeeGoalsIsError,
    isLoading: employeeGoalsIsLoading,
    refetch: employeeGoalsRefetch,
  } = useGetEmployeeGoalsQuery({ EMP_ID, ORG_ID });

  useEffect(() => {
    if (localStorage.getItem("goalsTour") === "true") return;

    const timeout = setTimeout(() => {
      const createGoalEl = document.querySelector("#create-goal");
      const allGoalEl = document.querySelector("#allGoal");
      const goalOverviewEl = document.querySelector("#goalOverview");

      if (createGoalEl && allGoalEl && goalOverviewEl) {
        const tour = driver({
          showProgress: true,
          steps: [
            {
              element: "#create-goal",
              popover: {
                title: "Create a Goal",
                description: `Set and track your personal goals to stay focused. Break big objectives into milestones and measure your progress over time. <a href="https://www.wazopulse.com/goals/#user-guide" target="_blank"> <span style="color:#585DF9; text-decoration:underline;">Learn more...</span> </a>`,
                side: "bottom",
              },
            },
            {
              element: "#allGoal",
              popover: {
                title: "All Goals",
                description:
                  "This is your personal goal tracker—a space to view all your active and completed goals in one place to help you manage what you’ve set out to achieve, monitor your progress, and celebrate your growth over time. You can also click on the goal to create tasks for your goal.",
                side: "bottom",
              },
            },
            {
              element: "#goalOverview",
              popover: {
                title: "Upcoming Goals",
                description:
                  "Here you can view your upcoming goals, track their deadlines, and monitor your progress to stay organized and productive.",
                side: "bottom",
              },
            },
          ],
          onDestroyStarted: () => {
            localStorage.setItem("goalsTour", "true");
            tour.destroy();
            setIsDemoMode(false);
          },
        });
        tour.drive();
        tourRef.current = tour;
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
      if (tourRef.current) {
        tourRef.current.destroy();
        tourRef.current = null;
      }
    };
  }, [employeeGoalsData]);

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="!text-2xl !text-[#4F4F51] m-0">Employee Goals</h1>
          <Tooltip title={"Learn more about Goals"} arrow>
            <NavLink
              id="learn-more"
              to={"https://www.wazopulse.com/goals"}
              target="_blank"
            >
              <p className="text-[#585DF9] text-xs mt-2">Info</p>
            </NavLink>
          </Tooltip>
        </div>
        <button
          className="text-sm text-white bg-gradient-to-b from-[#7E92F8] to-[#6972F0] px-3 py-2 !rounded-md min-w-[100px] flex flex-row gap-0.5 items-center"
          onClick={handleOpen}
          id="create-goal"
        >
          Create Goal
        </button>
      </div>
      <ErrorBoundary fallback={<ErrorFallback />}>
        <EmployeeGoals
          employeeGoalsData={isDemoMode ? demoData : employeeGoalsData}
          employeeGoalsIsError={employeeGoalsIsError}
          employeeGoalsIsLoading={employeeGoalsIsLoading}
          employeeGoalsRefetch={employeeGoalsRefetch}
        />
        <EmployeeGoalCreate handleClose={handleClose} open={open} />
      </ErrorBoundary>
    </div>
  );
};

export default OKR;
