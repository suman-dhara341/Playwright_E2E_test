import { Link, useParams } from "react-router-dom";
import {
  useGetEmployeeGoalsDetailsQuery,
  useGetEmployeeTaskQuery,
} from "../queries/okrQuery";
import { useSelector } from "react-redux";
import Error from "../../../utilities/Error";
import EmployeeGoalTask from "./EmployeeGoalTask";
import { CalendarDays, ChevronRight, Hourglass } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import EmployeeGoalsUpdate from "./EmployeeGoalsUpdate";
import ActionButton from "../../../common/ActionButton";
import EmployeeGoalTaskCreate from "./EmployeeGoalTaskCreate";
import "../css/okr.css";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import EmployeeGoalDetailsShimmer from "./shimmer/EmployeeGoalDetailsShimmer";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const EmployeeGoalDetails = () => {
  const { id } = useParams<{ id: string }>();
  const GOAL_ID = id;
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const [editOpen, setEditOpen] = useState(false);
  const editHandleOpen = () => setEditOpen(true);
  const editHandleClose = () => setEditOpen(false);

  const [taskOpen, setTaskOpen] = useState(false);
  const taskHandleOpen = () => setTaskOpen(true);
  const taskHandleClose = () => setTaskOpen(false);
  const [isDemoMode, setIsDemoMode] = useState(
    localStorage.getItem("goalsDetailsTour") !== "true"
  );
  const tourRef = useRef<any>(null);

  const useTimeAgo = (date: string) =>
    date
      ? new Intl.DateTimeFormat("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(new Date(date))
      : "-";

  const handleReciveSelection = (option: string) => {
    if (option === "Create Task") {
      taskHandleOpen();
    } else if (option === "Update Goal") {
      editHandleOpen();
    } else {
      console.log("delete");
    }
  };

  const {
    data: employeeGoalsDetailsData,
    isError: employeeGoalsDetailsIsError,
    isLoading: employeeGoalsDetailsIsLoading,
    refetch: employeeGoalsDetailsRefetch,
  } = useGetEmployeeGoalsDetailsQuery({ ORG_ID, EMP_ID, GOAL_ID });

  const {
    data: employeeGoalsTaskData,
    isError: employeeGoalsTaskIsError,
    isLoading: employeeGoalsTaskIsLoading,
    refetch,
  } = useGetEmployeeTaskQuery({ ORG_ID, EMP_ID, GOAL_ID });

  const demoData = {
    data: [
      {
        commentCount: 0,
        goalId: "demo-goal-id-1234",
        status: "NOT STARTED",
        taskDescription: "Complete AWS developer Certification Updated",
        taskId: "demo-task-id-5678",
        taskName: "Complete AWS developer Certification Updated",
      },
    ],
  };
  useEffect(() => {
    if (localStorage.getItem("goalsDetailsTour") === "true") return;

    const timeout = setTimeout(() => {
      const createTaskEl = document.querySelector("#create-task");
      const totalTaskEl = document.querySelector("#total-task");

      if (createTaskEl && totalTaskEl) {
        const tour = driver({
          showProgress: true,
          steps: [
            {
              element: "#create-task",
              popover: {
                title: "Create a Task",
                description: "Click here to create a new task .",
                side: "bottom",
              },
            },
            {
              element: "#total-task",
              popover: {
                title: "All Tasks",
                description:
                  "Browse through all your current and past tasks. You can edit, comment, or delete them from here.",
                side: "bottom",
              },
            },
          ],
          onDestroyStarted: () => {
            localStorage.setItem("goalsDetailsTour", "true");
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
  }, [employeeGoalsTaskData]);

  if (employeeGoalsDetailsIsLoading && employeeGoalsTaskIsLoading) {
    return <EmployeeGoalDetailsShimmer />;
  }

  if (employeeGoalsDetailsIsError && employeeGoalsTaskIsError) {
    return (
      <div
        className="flex justify-center items-center h-[calc(100vh-90px)] mt-3 p-3 bg-white rounded-md"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <Error />
      </div>
    );
  }

  return (
    <div className="min-h-[70vh]">
      <div
        className="bg-white relative rounded-md mb-3"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <div className="w-full flex justify-between px-3 pt-6 pb-3 gap-4">
          <div className="w-[88%]">
            <div className="">
              <div className="flex gap-1 items-center mb-2">
                <Link to="/goals" className="!text-[#585df9]">
                  All Goals
                </Link>{" "}
                <ChevronRight className="w-3 h-3" />
              </div>
              <p className="text-2xl leading-[16px] font-bold tracking-[0px] text-[#3F4354] mb-3">
                {employeeGoalsDetailsData?.data?.title}
              </p>
            </div>
            <p>{employeeGoalsDetailsData?.data?.description}</p>
            <div className="flex flex-wrap gap-2 my-2">
              {employeeGoalsDetailsData?.data?.tags.map((tag, idx) => (
                <div className="bg-[#F4F6F8] py-[2px] px-[8px] rounded">
                  <span
                    key={idx}
                    className="text-xs text-[#858EAD] font-semibold"
                  >
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-[12%]">
            <div className="w-24 h-24 mr-6">
              <CircularProgressbar
                value={
                  employeeGoalsDetailsData?.data?.completionPercentage ?? 0
                }
                text={`${employeeGoalsDetailsData?.data?.completionPercentage}%`}
                styles={buildStyles({
                  textSize: "22px",
                  pathColor: "#00c951",
                  textColor: "#00c951",
                  trailColor: "#E8E8EC",
                })}
                className="custom-progressbar"
              />
            </div>
          </div>
        </div>

        <div className="absolute top-[15px] right-[15px]">
          <ActionButton
            options={[
              { value: "Create Task", label: "Create Task" },
              { value: "Update Goal", label: "Update Goal" },
              { value: "Delete Goal", label: "Delete Goal" },
            ]}
            defaultOption="Type"
            onSelect={handleReciveSelection}
          />
        </div>
        <div className="flex gap-2 border-t-1 border-[#E8E8EC] p-3">
          <div className="flex items-center gap-2">
            <Hourglass className="w-4 h-4 text-[#aa5818]" />

            <div>
              {employeeGoalsDetailsData?.data?.status === "DEFERRED" && (
                <p className="bg-[#f0f2f3] font-bold rounded-md p-1 text-[#5e697e] text-xs leading-none">
                  {employeeGoalsDetailsData?.data?.status}
                </p>
              )}
              {employeeGoalsDetailsData?.data?.status === "NOT STARTED" && (
                <p className="bg-[#f0f2f3] font-bold rounded-md p-1 text-[#5e697e] text-xs leading-none">
                  {employeeGoalsDetailsData?.data?.status}
                </p>
              )}
              {employeeGoalsDetailsData?.data?.status === "STARTED" && (
                <p className="bg-[#f0f2f3] font-bold rounded-md p-1 text-[#5e697e] text-xs leading-none">
                  {employeeGoalsDetailsData?.data?.status}
                </p>
              )}
              {employeeGoalsDetailsData?.data?.status === "IN PROGRESS" && (
                <p className="bg-[#e9f2ff] font-bold text-[#0055cc] rounded-md p-1 text-xs leading-none">
                  {employeeGoalsDetailsData?.data?.status}
                </p>
              )}
              {employeeGoalsDetailsData?.data?.status === "COMPLETED" && (
                <p className="bg-[#dffff2] font-bold text-[#458b6f] rounded-md p-1 text-xs leading-none">
                  {employeeGoalsDetailsData?.data?.status}
                </p>
              )}
            </div>
            <i className="fa-solid fa-circle !text-[3px] !text-[#73737D]"></i>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-[#3F4354]" />
            <p className="text-[#878791] text-xs">
              {useTimeAgo(employeeGoalsDetailsData?.data?.dueDate || "")}
            </p>
          </div>
        </div>
        <EmployeeGoalsUpdate
          employeeGoalsDetailsData={employeeGoalsDetailsData?.data}
          employeeGoalsDetailsRefetch={employeeGoalsDetailsRefetch}
          open={editOpen}
          handleClose={editHandleClose}
        />
        <EmployeeGoalTaskCreate
          handleClose={taskHandleClose}
          open={taskOpen}
          GOAL_ID={GOAL_ID || ""}
          employeeGoalsDetailsRefetch={employeeGoalsDetailsRefetch}
        />
      </div>

      <div
        className="bg-white rounded-md"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <EmployeeGoalTask
          employeeGoalsTaskData={isDemoMode ? demoData : employeeGoalsTaskData}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default EmployeeGoalDetails;
