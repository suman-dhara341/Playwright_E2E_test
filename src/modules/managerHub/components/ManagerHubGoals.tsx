import React, { useState } from "react";
import {
  useGetEmployeeGoalsQuery,
  useLazyGetEmployeeGoalsByTagsQuery,
} from "../../goals/queries/okrQuery";
import Error from "../../../utilities/Error";
import { useSelector } from "react-redux";
import { ChevronDown, ChevronRight, Goal } from "lucide-react";
import ManagerHubGoalsDetails from "./ManagerHubGoalsDetails";
import ManagerHubGoalsShimmer from "./shimmer/ManagerHubGoalsShimmer";

const ManagerHubGoals = ({ employeeId }: any) => {
  const EMP_ID = employeeId
    ? employeeId
    : useSelector((state: any) => state.auth.userData["custom:empId"]);
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const {
    data: employeeGoalsData,
    isError: employeeGoalsIsError,
    isLoading: employeeGoalsIsLoading,
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

  const isLoading = selectedTag
    ? employeeGoalsByTagIsLoading
    : employeeGoalsIsLoading;

  const isError = selectedTag
    ? employeeGoalsByTagIsError
    : employeeGoalsIsError;

  // isLoading
  if (isLoading) {
    return <ManagerHubGoalsShimmer />;
  }

  if (isError) {
    return (
      <div
        className="flex justify-center items-center mt-3 h-[calc(100vh-215px)] p-3 bg-white rounded-md"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <Error />
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-md w-full flex gap-3 mt-3"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
    >
      <div className="w-full flex flex-col h-[calc(100vh-215px)]">
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
        <div className="overflow-y-auto w-full h-full" id="myTeamGoals">
          <table className="w-full text-sm text-left text-[#3F4354]">
            <thead className="text-[#3F4354] !border-b-1 !border-[#E8E8EC] uppercase text-xs font-medium">
              <tr>
                <th className="w-[35%] p-3">Title</th>
                <th className="w-[15%] p-3">Due Month</th>
                <th className="w-[15%] p-3">Progress</th>
              </tr>
            </thead>
            <tbody>
              {goalsToDisplay?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-[#73737D]">
                    You have no goals. Create your goal.
                  </td>
                </tr>
              ) : (
                goalsToDisplay?.map((goal) => {
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
                              <Goal className="w-4 w-4" color="#585DF9" />
                            </div>
                            <p className="font-semibold text-[#3F4354]">
                              {goal.title}
                            </p>
                          </div>
                        </td>
                        <td className="w-[15%] px-3 py-2 text-[#878791]">
                          {useTimeAgo(goal.dueDate)}
                        </td>
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
                      </tr>

                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="p-3">
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
                              <ManagerHubGoalsDetails
                                employeeId={employeeId}
                                expandedGoalId={goal.goalId}
                              />
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
        </div>
      </div>
    </div>
  );
};

export default ManagerHubGoals;
