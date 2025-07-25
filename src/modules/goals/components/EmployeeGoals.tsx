import React, { useState } from "react";
import {
  useDeleteEmployeeGoalsMutation,
  useLazyGetEmployeeGoalsByTagsQuery,
} from "../queries/okrQuery";
import Error from "../../../utilities/Error";
import { useSelector } from "react-redux";
import {
  ChartPie,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Goal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import ActionButton from "../../../common/ActionButton";
import { showToast } from "../../../utilities/toast";
import EmployeeGoalsUpdate from "./EmployeeGoalsUpdate";
import EmployeeGoalsShimmer from "./shimmer/EmployeeGoalsShimmer";

interface goalInt {
  employeeGoalsData?: any;
  employeeGoalsIsError?: boolean;
  employeeGoalsIsLoading?: boolean;
  employeeGoalsRefetch?: any;
}

const EmployeeGoals: React.FC<goalInt> = ({
  employeeGoalsData,
  employeeGoalsIsError,
  employeeGoalsIsLoading,
  employeeGoalsRefetch,
}) => {
  const navigate = useNavigate();
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const [editGoal, setEditGoal] = useState(null);
  const [showAllTags, setShowAllTags] = React.useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const editHandleOpen = () => setEditOpen(true);
  const editHandleClose = () => setEditOpen(false);

  const [triggerDeleteTask] = useDeleteEmployeeGoalsMutation();
  const [
    triggerGoalsByTags,
    {
      data: employeeGoalsByTagData,
      isError: employeeGoalsByTagIsError,
      isLoading: employeeGoalsByTagIsLoading,
    },
  ] = useLazyGetEmployeeGoalsByTagsQuery();

  const useTimeAgo = (date: string) =>
    date
      ? new Intl.DateTimeFormat("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(new Date(date))
      : "-";

  const toggleExpand = (goalId: string) => {
    setExpandedRow((prev) => (prev === goalId ? null : goalId));
  };

  const handleRowClick = (goalId: string) => {
    goalsToDisplay[0]?.isDemoExpanded
      ? ""
      : navigate(`/goal-details/${goalId}`);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    triggerGoalsByTags({ EMP_ID, ORG_ID, TAG_ID: tag });
  };

  const clearFilter = () => {
    setSelectedTag(null);
  };

  console.log(selectedTag);

  const goalsToDisplay = selectedTag
    ? employeeGoalsByTagData?.data || []
    : employeeGoalsData?.data || [];

  const isLoading = selectedTag
    ? employeeGoalsByTagIsLoading
    : employeeGoalsIsLoading;

  const isError = selectedTag
    ? employeeGoalsByTagIsError
    : employeeGoalsIsError;

  const validGoals =
    goalsToDisplay?.filter((goal: any) => goal?.completionPercentage != null) ||
    [];

  const overallCompletionPercentage = validGoals.length
    ? validGoals.reduce(
        (sum: any, goal: any) => sum + goal.completionPercentage,
        0
      ) / validGoals.length
    : 0;

  const completedGoals =
    goalsToDisplay?.filter((goal: any) =>
      ["COMPLETED", "APPROVED"].includes(goal?.status)
    ) || [];
  const pendingGoals =
    goalsToDisplay?.filter((goal: any) =>
      ["IN PROGRESS", "STARTED", "NOT STARTED"].includes(goal?.status)
    ) || [];

  const handleDelete = async ({ GOAL_ID, event }: any) => {
    event.stopPropagation();
    try {
      await triggerDeleteTask({
        ORG_ID,
        EMP_ID,
        GOAL_ID,
      }).unwrap();
      employeeGoalsRefetch();
      showToast("successfully Goals deleted ", "success");
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to delete goals", "error");
    }
  };

  const handleReciveSelection = (option: string, goal: any) => {
    if (option === "Edit Goal") {
      setEditGoal(goal);
      editHandleOpen();
    } else if (option === "Delete Goal") {
      handleDelete({ GOAL_ID: goal.goalId, event: new Event("click") });
    } else if (option === "Request for Approval") {
      setEditGoal(goal.goalId);
    } else {
      console.log("WAZO");
    }
  };

  const calculateDaysLeft = (dueDate: string) => {
    const today = dayjs();
    const due = dayjs(dueDate);
    const diff = due.diff(today, "day");
    return diff >= 0 ? `${diff} day(s) left` : `Past due`;
  };

  if (isLoading) {
    return <EmployeeGoalsShimmer />;
  }

  if (isError) {
    return (
      <div
        className="flex justify-center items-center h-[calc(100vh-140px)] mt-3 p-3 bg-white rounded-md"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <Error />
      </div>
    );
  }

  return (
    <div className="w-full flex gap-3">
      <div
        className="w-[75%] flex flex-col h-[calc(100vh-140px)] bg-white rounded-md mt-3"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        {selectedTag && (
          <div className="flex justify-between items-center pt-3 px-3">
            <p className="text-sm text-[#73737D]">
              Showing results for tag:{" "}
              <span className="font-semibold">{selectedTag}</span>
            </p>
            <button
              onClick={clearFilter}
              className="text-xs bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* Tag Filter Section */}
        {goalsToDisplay?.length > 0 &&
          (() => {
            const tagCountMap: Record<string, number> = {};

            goalsToDisplay.forEach((goal: any) => {
              goal.tags.forEach((tag: string) => {
                tagCountMap[tag] = (tagCountMap[tag] || 0) + 1;
              });
            });

            const tagEntries = Object.entries(tagCountMap);
            const visibleTags = showAllTags
              ? tagEntries
              : tagEntries.slice(0, 5);

            return (
              <div className="flex justify-between items-start p-3 border-b border-[#E8E8EC]">
                <div className="flex flex-wrap gap-2">
                  {visibleTags.map(([tag, count]) => (
                    <div
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`cursor-pointer px-3 py-1 rounded text-xs font-medium ${
                        selectedTag === tag
                          ? "bg-[#585DF9] text-white"
                          : "bg-[#F4F6F8] text-[#3F4354] hover:bg-[#e4e6e9]"
                      }`}
                    >
                      {tag} ({count})
                    </div>
                  ))}
                </div>

                {tagEntries.length > 5 && (
                  <div>
                    <button
                      onClick={() => setShowAllTags((prev) => !prev)}
                      className="flex mx-1 gap-2 items-center text-xs text-blue-600 hover:underline"
                    >
                      {showAllTags ? "Collapse " : "Expand"}
                      {showAllTags ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

        <div className="overflow-y-auto w-full h-full">
          <table
            id="allGoal"
            className="w-full text-sm text-left text-[#3F4354]"
          >
            <thead className="text-[#3F4354] !border-b-1 !border-[#E8E8EC] uppercase text-xs font-medium">
              <tr>
                <th className="w-[40%] p-3">Title</th>
                <th className="w-[15%] p-3">Target Date</th>
                <th className="w-[15%] p-3">Days Left</th>
                <th className="w-[20%] p-3">Progress</th>
                <th className="w-[10%] p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody id="allGoal">
              {goalsToDisplay?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-[#73737D]">
                    You have no goals. Create your goal.
                  </td>
                </tr>
              ) : (
                goalsToDisplay?.map((goal: any) => {
                  const isExpanded = expandedRow === goal.goalId;
                  console.log(isExpanded,"isExpanded")
                  console.log(goalsToDisplay,"goalsToDisplay[0]?.isDemoExpanded")
                  return (
                    <React.Fragment key={goal.goalId}>
                      <tr className="cursor-pointer hover:bg-gray-50 !border-b-1 !border-[#E8E8EC]">
                        <td className="w-[40%] px-3 py-2">
                          <div className="flex gap-2 items-center">
                            <div
                              className="flex items-center gap-2"
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleExpand(goal.goalId);
                              }}
                            >
                              {isExpanded ||
                              goalsToDisplay[0]?.isDemoExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                              <Goal className="w-4 w-4" color="#585DF9" />
                            </div>
                            <p
                              className="font-semibold text-[#3F4354] hover:underline underline-offset-1"
                              onClick={() => handleRowClick(goal?.goalId)}
                            >
                              {goal.title}
                            </p>
                          </div>
                        </td>
                        <td className="w-[15%] px-3 py-2 text-[#878791]">
                          {useTimeAgo(goal.dueDate)}
                        </td>
                        <td className="w-[15%] px-3 py-2 text-[#878791]">
                          {goal.dueDate ? calculateDaysLeft(goal.dueDate) : "-"}
                        </td>
                        <td className="w-[20%] px-3 py-2">
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${goal.completionPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-[#73737D]">
                            {goal.completionPercentage}%
                          </span>
                        </td>
                        <td className="w-[10%] px-3 py-2">
                          <ActionButton
                            options={[
                              { value: "Edit Goal", label: "Edit Goal" },
                              { value: "Delete Goal", label: "Delete Goal" },
                            ]}
                            defaultOption="Type"
                            onSelect={(option) =>
                              handleReciveSelection(option, goal)
                            }
                          />
                        </td>
                      </tr>

                      {!isExpanded ||
                        (goalsToDisplay && (
                          <tr>
                            <td colSpan={6} className="px-4 py-3">
                              <div className="space-y-2">
                                <div className="flex gap-2 mb-2">
                                  <p className="text-[#3F4354] font-semibold">
                                    Description:
                                  </p>
                                  <p>{goal.description}</p>
                                </div>
                                <div className="flex gap-2 mb-2">
                                  <p className="text-[#3F4354] font-semibold">
                                    Tags:
                                  </p>
                                  <div className="flex gap-2 flex-wrap">
                                    {goal.tags.map((tag: string, i: number) => (
                                      <div
                                        key={i}
                                        className="bg-[#F4F6F8] py-[3px] px-[8px] rounded cursor-pointer hover:bg-[#e4e6e9]"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleTagClick(tag);
                                        }}
                                      >
                                        <p className="text-[#858EAD] text-[10px]">
                                          {tag}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
          <EmployeeGoalsUpdate
            employeeGoalsDetailsData={editGoal}
            employeeGoalsDetailsRefetch={employeeGoalsRefetch}
            open={editOpen}
            handleClose={editHandleClose}
          />
        </div>
      </div>
      <div className="w-[25%] py-3" id="goalOverview">
        <div
          className="bg-white rounded-md flex items-center gap-3 p-2 mb-3"
          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
        >
          <div className="w-12 h-12 border-4 border-[#585DF9] flex items-center justify-center rounded-full">
            <Goal className="w-6 w-6" color="#585DF9" />
          </div>
          <div>
            <div className="flex gap-2">
              <p className="text-lg font-semibold text-[#3F4354]">
                Total Goals
              </p>
              <p className="text-xl text-[#3F4354] font-bold">
                {goalsToDisplay?.length}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <p className="text-sm text-[#73737D]">
                Pending {pendingGoals.length}
              </p>
              <i className="fa-solid fa-circle !text-[3px] !text-[#73737D]"></i>
              <p className="text-sm text-[#73737D]">
                Complete {completedGoals.length}
              </p>
            </div>
          </div>
        </div>
        <div
          className="bg-white rounded-md flex items-center gap-3 p-2 mb-3"
          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
          id="progress"
        >
          <div className="w-12 h-12 border-4 border-[#00c951] flex items-center justify-center rounded-full">
            <ChartPie className="w-6 h-6" color="#00c951" />
          </div>
          <div>
            <p className="text-lg font-semibold text-[#3F4354]">Progress</p>
            <p className="text-xl text-[#3F4354] font-bold">
              {Number(overallCompletionPercentage).toFixed(0)} %
            </p>
          </div>
        </div>
        <div
          className="bg-white rounded-md flex items-center gap-3 py-2 px-3 mb-3"
          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
          id="yourUpcomingGoal"
        >
          <div>
            <p className="text-lg font-semibold text-[#3F4354] mb-3">
              Your upcoming goals
            </p>

            <div>
              {goalsToDisplay?.length === 0 ? (
                <p>No goals available</p>
              ) : (
                <div className="w-full">
                  {[...goalsToDisplay]
                    .filter((goal) => {
                      const due = new Date(goal.dueDate);
                      const now = new Date();
                      return (
                        !isNaN(due.getTime()) &&
                        due >= new Date(now.toDateString())
                      );
                    })
                    .sort(
                      (a, b) =>
                        new Date(a.dueDate).getTime() -
                        new Date(b.dueDate).getTime()
                    )
                    .map((goal, index, sortedGoals) => {
                      const isLastItem = index === sortedGoals.length - 1;

                      const dueDateObj = new Date(goal.dueDate);
                      const dueDate = !isNaN(dueDateObj.getTime())
                        ? dueDateObj
                            .toISOString()
                            .slice(0, 10)
                            .replace(/-/g, "/")
                        : "Invalid date";

                      return (
                        <div
                          key={goal.goalId || index}
                          className="relative flex gap-3 mb-0 w-full"
                        >
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-[#4B3FE4]"></div>
                            {!isLastItem && (
                              <div className="w-[2px] h-full bg-[#A0A0A0]"></div>
                            )}
                          </div>

                          <div
                            className={`w-full ${isLastItem ? "mb-0" : "mb-3"}`}
                          >
                            <div className="mb-2">
                              <p className="text-sm font-semibold text-[#3F4354] leading-4 mb-2">
                                {goal.title.length > 30
                                  ? `${goal.title.slice(0, 30)}...`
                                  : goal.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-sm text-[#73737D]">
                                  {useTimeAgo(dueDate)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeGoals;
