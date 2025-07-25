import React, { useState } from "react";
import Drawer from "../../../common/Drawer";
import { ClipboardList, MessageCircle } from "lucide-react";
import ManagerHubGoalsComment from "./ManagerHubGoalsComment";
import { useGetEmployeeTaskQuery } from "../../goals/queries/okrQuery";
import { useSelector } from "react-redux";
import Loading from "../../../utilities/Loading";
import Error from "../../../utilities/Error";

const ManagerHubGoalsDetails = ({ employeeId, expandedGoalId }: any) => {
  const GOAL_ID = expandedGoalId;
  const EMP_ID = employeeId;
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const {
    data: employeeGoalsTaskData,
    isError: employeeGoalsTaskIsError,
    isLoading: employeeGoalsTaskIsLoading,
  } = useGetEmployeeTaskQuery({ ORG_ID, EMP_ID, GOAL_ID });
  const [isOpen, setIsOpen] = useState(false);
  const [tasGoalskId, setGoalsTaskId] = useState("");
  const [expandedTasks, setExpandedTasks] = useState<{
    [taskId: string]: boolean;
  }>({});

  const toggleTaskDescription = (taskId: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  if (employeeGoalsTaskIsLoading) {
    return (
      <div className="border-1 border-[#E8E8EC] flex justify-center items-center mt-2 min-h-[70vh] p-3 bg-white rounded-md">
        <Loading />
      </div>
    );
  }

  if (employeeGoalsTaskIsError) {
    return (
      <div className="border-1 border-[#E8E8EC] flex justify-center items-center mt-2 min-h-[70vh] p-3 bg-white rounded-md">
        <Error />
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <div className="w-full flex items-center justify-between">
          <p className="text-[#3F4354] font-semibold">
            Tasks : 
          </p>
        </div>
      </div>
      <div className="overflow-x-auto w-full min-h-[40vh] border-1 border-[#E8E8EC] rounded-md">
        <table className="w-full text-sm text-left text-[#3F4354]">
          <thead className="text-[#3F4354] !border-b-1 !border-[#E8E8EC] uppercase text-xs font-medium">
            <tr>
              <th className="w-[35%] px-4 py-3">Task Name</th>
              <th className="w-[40%] px-4 py-3">Task Description</th>
              <th className="w-[20%] px-4 py-3">Status</th>
              <th className="w-[10%] px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {employeeGoalsTaskData?.data &&
            employeeGoalsTaskData.data.length > 0 ? (
              employeeGoalsTaskData.data.map((task: any) => {
                return (
                  <React.Fragment key={task.taskId}>
                    <tr className="border-t border-gray-200 cursor-pointer hover:bg-gray-50 !border-b-1 !border-[#E8E8EC]">
                      <td className="w-[35%] px-4 py-3">
                        <div className="flex gap-2 items-center">
                          <ClipboardList
                            className="w-5 h-5 text-[#0055cc]"
                            aria-label="Task Icon"
                          />

                          <p className="font-semibold text-[#3F4354]">
                            {task.taskName}
                          </p>
                        </div>
                      </td>
                      <td className="w-[40%] px-4 py-3">
                          <p
                            className="text-sm text-[#3F4354] cursor-pointer"
                            onClick={() => toggleTaskDescription(task.taskId)}
                          >
                            {expandedTasks[task.taskId] ? (
                              task.taskDescription
                            ) : task.taskDescription.length > 100 ? (
                              <>
                                {task.taskDescription.slice(0, 100)}
                                <span className="text-blue-600 font-medium">
                                  ... show more
                                </span>
                              </>
                            ) : (
                              task.taskDescription
                            )}
                          </p>
                      </td>
                      <td className="w-[15%] px-4 py-3">
                        <div className="flex items-center gap-1">
                          <div>
                            {task.status === "DEFERRED" && (
                              <p className="bg-[#f0f2f3] font-bold rounded-md p-1 text-[#5e697e] text-xs leading-none">
                                {task.status}
                              </p>
                            )}
                            {task.status === "NOT STARTED" && (
                              <p className="bg-[#f0f2f3] font-bold rounded-md p-1 text-[#5e697e] text-xs leading-none">
                                {task.status}
                              </p>
                            )}
                            {task.status === "IN PROGRESS" && (
                              <p className="bg-[#e9f2ff] font-bold text-[#0055cc] rounded-md p-1 text-xs leading-none">
                                {task.status}
                              </p>
                            )}
                            {task.status === "COMPLETED" && (
                              <p className="bg-[#dffff2] font-bold text-[#458b6f] rounded-md p-1 text-xs leading-none">
                                {task.status}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="w-[10%] px-4 py-3">
                        <div className="flex justify-center gap-4">
                          <div
                            className="flex gap-2 justify-center"
                            onClick={() => {
                              setGoalsTaskId(task.taskId);
                              setIsOpen(true);
                            }}
                          >
                            <MessageCircle
                              aria-label="Comments"
                              className="w-5 h-5"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-[#73737D]">
                  You don't have any tasks against your goal.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} heading="Comments">
          <ManagerHubGoalsComment
            GOAL_ID={GOAL_ID || ""}
            TASK_ID={tasGoalskId || ""}
          />
        </Drawer>
      </div>
    </>
  );
};

export default ManagerHubGoalsDetails;
