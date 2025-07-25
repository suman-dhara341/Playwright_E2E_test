import React, { useState } from "react";
import {
  useDeleteEmployeeGoalsMutation,
  useGetEmployeeGoalsQuery,
  useLazyGetEmployeeGoalsByTagsQuery,
} from "../queries/okrQuery";
import Loading from "../../../utilities/Loading";
import Error from "../../../utilities/Error";
import { useSelector } from "react-redux";
import {
  ChartPie,
  ChevronDown,
  ChevronRight,
  Goal,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import ActionButton from "../../../common/ActionButton";
import { showToast } from "../../../utilities/toast";
import EmployeeGoalsUpdate from "./EmployeeGoalsUpdate";
import EmployeeApprovalRequestModal from "./EmployeeApprovalRequestModal";
const EmployeeGoalsApproval: React.FC = () => {
  const navigate = useNavigate();
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const [editGoal, setEditGoal] = useState(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const editHandleOpen = () => setEditOpen(true);
  const editHandleClose = () => setEditOpen(false);

  const [approvalRequestOpen, setApprovalRequestOpen] = useState(false);
  const approvalRequestHandleOpen = () => setApprovalRequestOpen(true);
  const approvalRequestHandleClose = () => setApprovalRequestOpen(false);
  const [triggerDeleteTask] = useDeleteEmployeeGoalsMutation();
  const {
    data: employeeGoalsData,
    isError: employeeGoalsIsError,
    isLoading: employeeGoalsIsLoading,
    refetch: employeeGoalsRefetch,
  } = useGetEmployeeGoalsQuery({ EMP_ID, ORG_ID });

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
    navigate(`/goal-details/${goalId}`);
  };

  const handleTagClick = async (tag: string) => {
    setSelectedTag(tag);
    triggerGoalsByTags({ EMP_ID, ORG_ID, TAG_ID: tag });
  };

  const clearFilter = () => {
    setSelectedTag(null);
  };

  const goalsToDisplay = selectedTag
    ? employeeGoalsByTagData?.data || []
    : employeeGoalsData?.data || [];

  const filteredGoals = goalsToDisplay.filter(
    (goal) => goal.status === "APPROVED" || goal.status === "PENDING"
  );

  const isLoading = selectedTag
    ? employeeGoalsByTagIsLoading
    : employeeGoalsIsLoading;

  const isError = selectedTag
    ? employeeGoalsByTagIsError
    : employeeGoalsIsError;

  const validGoals =
    goalsToDisplay?.filter((goal) => goal?.completionPercentage != null) || [];

  const overallCompletionPercentage = validGoals.length
    ? validGoals.reduce((sum, goal) => sum + goal.completionPercentage, 0) /
      validGoals.length
    : 0;

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
      approvalRequestHandleOpen();
      setEditGoal(goal.goalId);
    } else {
      console.log("WAZO");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-2 min-h-[70vh] p-3 bg-white rounded-md">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center mt-2 min-h-[70vh] p-3 bg-white rounded-md">
        <Error />
      </div>
    );
  }

  return (
    <div className="w-full flex gap-3">
      <div className="w-[75%] flex flex-col min-h-[70vh] bg-white rounded-md mt-3 border-1 border-[#E8E8EC]">
        {selectedTag && (
          <div className="flex justify-between items-center p-3">
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
        <div className="overflow-y-auto w-full h-full">
          <table className="w-full text-sm text-left text-[#3F4354]">
            <thead className="text-[#3F4354] !border-b-1 !border-[#E8E8EC] uppercase text-xs font-medium">
              <tr>
                <th className="w-[35%] p-3">Title</th>
                {/* <th className="w-[10%] p-3">Timeline</th> */}
                <th className="w-[15%] p-3">Due Date</th>
                <th className="w-[15%] p-3">Status</th>
                <th className="w-[15%] p-3">Progress</th>
                <th className="w-[10%] p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredGoals?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-[#73737D]">
                    You don't have any pending goals .
                  </td>
                </tr>
              ) : (
                filteredGoals?.map((goal) => {
                  const isExpanded = expandedRow === goal.goalId;
                  return (
                    <React.Fragment key={goal.goalId}>
                      <tr className="cursor-pointer hover:bg-gray-50 !border-b-1 !border-[#E8E8EC]">
                        <td className="w-[35%] px-3 py-2">
                          <div className="flex gap-2 items-center">
                            <div
                              className="flex items-center gap-2"
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleExpand(goal.goalId);
                              }}
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                              <Goal className="w-4 w-4" />
                            </div>
                            <p
                              className="font-semibold text-[#3F4354] hover:underline underline-offset-1"
                              onClick={() => handleRowClick(goal.goalId)}
                            >
                              {goal.title}
                            </p>
                          </div>
                        </td>
                        <td className="w-[15%] px-3 py-2 text-[#878791]">
                          {useTimeAgo(goal.dueDate)}
                        </td>
                        <th className="w-[15%] p-3">
                          <div className="inline-block">
                            {goal.isApproved ? (
                              <p className="bg-[#d9daff] text-[#585DF9] rounded-md p-1 text-xs leading-none">
                                Approved
                              </p>
                            ) : (
                              <p className="bg-[#fff8d6] text-[#aa5818] rounded-md p-1 text-xs leading-none">
                                Pending
                              </p>
                            )}
                          </div>
                        </th>
                        <td className="w-[15%] px-3 py-2">
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
                              ...(goal.status === "COMPLETED"
                                ? [
                                    {
                                      value: "Request for Approval",
                                      label: "Request for Approval",
                                    },
                                  ]
                                : []),
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

                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="px-4 py-3">
                            <div className="space-y-2">
                              <div className="flex gap-2 mb-2">
                                <p className="text-[#3F4354] font-semibold">
                                  Description:
                                </p>
                                <p className="text-[#878791]">
                                  {goal.description}
                                </p>
                              </div>
                              <div className="flex gap-2 mb-2">
                                <p className="text-[#3F4354] font-semibold">
                                  Tags:
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                  {goal.tags.map((tag, i) => (
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
                      )}
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
          <EmployeeApprovalRequestModal
            GOAL_ID={editGoal}
            employeeGoalsDetailsRefetch={employeeGoalsRefetch}
            open={approvalRequestOpen}
            handleClose={approvalRequestHandleClose}
          />
        </div>
      </div>
      <div className="w-[25%] py-3">
        <div className="bg-white rounded-md border-1 border-[#E8E8EC] flex items-center gap-3 p-2 mb-3">
          <div className="w-12 h-12 border-4 border-[#f1d589] flex items-center justify-center rounded-full">
            <Target className="w-6 h-6" color="#f1d589" />
          </div>
          <div>
            <p className="text-lg font-semibold text-[#3F4354]">Total Goals</p>
            <p className="text-xl text-[#3F4354] font-bold">
              {goalsToDisplay?.length}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-md border-1 border-1 border-[#E8E8EC] flex items-center gap-3 p-2 mb-3">
          <div className="w-12 h-12 border-4 border-[#00c951] flex items-center justify-center rounded-full">
            <ChartPie className="w-6 h-6" color="#00c951" />
          </div>
          <div>
            <p className="text-lg font-semibold text-[#3F4354]">Progress</p>
            <p className="text-xl text-[#3F4354] font-bold">
              {overallCompletionPercentage} %
            </p>
          </div>
        </div>
        <div className="bg-white rounded-md border-1 border-[#E8E8EC] flex items-center gap-3 py-2 px-3 mb-3">
          <div>
            <p className="text-lg font-semibold text-[#3F4354] mb-3">
              Timeline
            </p>

            <div>
              {goalsToDisplay?.length === 0 ? (
                <p>No goals available</p>
              ) : (
                <div>
                  {[...goalsToDisplay]
                    .sort((a, b) => dayjs(a.dueDate).diff(dayjs(b.dueDate)))
                    .map((goal, index, sortedGoals) => {
                      const isLastItem = index === sortedGoals.length - 1;
                      const dueDate = dayjs(goal.dueDate).isValid()
                        ? dayjs(goal.dueDate).format("YYYY/MM/DD")
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
                            className={`w-full ${isLastItem ? "mb-0" : "mb-4"}`}
                          >
                            <div className="mb-2">
                              <p className="text-sm font-semibold text-[#3F4354] leading-2 mb-2">
                                {goal.title.length > 30
                                  ? `${goal.title.slice(0, 30)}...`
                                  : goal.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-sm text-[#73737D]">
                                  {useTimeAgo(dueDate)}
                                </p>
                                <i className="fa-solid fa-circle !text-[3px] !text-[#73737D]"></i>

                                <div className="">
                                  {goal.isApproved ? (
                                    <p className="bg-[#d9daff] text-[#585DF9] rounded-md p-1 text-xs leading-none">
                                      Approved
                                    </p>
                                  ) : (
                                    <p className="bg-[#fff8d6] text-[#aa5818] rounded-md p-1 text-xs leading-none">
                                      Pending
                                    </p>
                                  )}
                                </div>
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

export default EmployeeGoalsApproval;
