import { useParams } from "react-router-dom";
import React, { useState } from "react";
import EmployeeGoalTaskUpdate from "./EmployeeGoalTaskUpdate";
import Drawer from "../../../common/Drawer";
import { ClipboardList, MessageCircle, Pencil, Trash2 } from "lucide-react";
import EmployeeGoalsComment from "./EmployeeGoalsComment";
import EmployeeGoalTaskCreate from "./EmployeeGoalTaskCreate";
import {
  useDeleteEmployeeTaskMutation,
  useGetEmployeeGoalsDetailsQuery,
} from "../queries/okrQuery";
import { useSelector } from "react-redux";
import { showToast } from "../../../utilities/toast";

const EmployeeGoalTask = ({ employeeGoalsTaskData, refetch }: any) => {
  const { id } = useParams<{ id: string }>();
  const GOAL_ID = id;
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  console.log(employeeGoalsTaskData);

  const [isOpen, setIsOpen] = useState(false);
  const [tasGoalskId, setGoalsTaskId] = useState("");
  const [taskUpdateOpen, setTaskUpdateOpen] = useState(false);
  const taskUpdateHandleOpen = () => setTaskUpdateOpen(true);
  const taskUpdateHandleClose = () => setTaskUpdateOpen(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [expandedTasks, setExpandedTasks] = useState<{
    [taskId: string]: boolean;
  }>({});
  const [taskOpen, setTaskOpen] = useState(false);
  const taskHandleOpen = () => setTaskOpen(true);
  const taskHandleClose = () => setTaskOpen(false);
  const [triggerDeleteTask] = useDeleteEmployeeTaskMutation();
  const { refetch: employeeGoalsDetailsRefetch } =
    useGetEmployeeGoalsDetailsQuery({ ORG_ID, EMP_ID, GOAL_ID });

  const handleDelete = async ({ GOAL_ID, TASK_ID }: any) => {
    try {
      await triggerDeleteTask({
        ORG_ID,
        EMP_ID,
        GOAL_ID,
        TASK_ID,
      }).unwrap();
      refetch();
      showToast("successfully task deleted ", "success");
    } catch (err: any) {
      showToast(err?.data?.message || "Failed to delete task", "error");
    }
  };

  const handleUpdate = (task: any) => {
    setSelectedTask(task);
    taskUpdateHandleOpen();
    setGoalsTaskId(task?.taskId);
  };

  const toggleTaskDescription = (taskId: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <div className="w-full flex items-center justify-between p-3">
          <p className="text-base leading-[16px] font-semibold tracking-[0px] text-[#3F4354]">
            Tasks
          </p>
          <button
            className="text-sm text-white bg-gradient-to-b from-[#7E92F8] to-[#6972F0] px-3 py-2 !rounded-md min-w-[100px] flex flex-row gap-0.5 items-center"
            onClick={taskHandleOpen}
            id="create-task"
          >
            Create Task
          </button>
        </div>

        <EmployeeGoalTaskCreate
          handleClose={taskHandleClose}
          open={taskOpen}
          GOAL_ID={GOAL_ID || ""}
          employeeGoalsDetailsRefetch={employeeGoalsDetailsRefetch}
        />
      </div>
      <div className="overflow-y-auto w-full h-[calc(100vh-390px)]">
        <table className="w-full text-sm text-left text-[#3F4354]">
          <thead className="text-[#3F4354] !border-b-1 !border-[#E8E8EC] uppercase text-xs font-medium">
            <tr>
              <th className="w-[25%] px-4 py-3">Task Name</th>
              <th className="w-[40%] px-4 py-3">Task Description</th>
              <th className="w-[15%] px-4 py-3">Status</th>
              <th className="w-[20%] px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody id="total-task">
            {employeeGoalsTaskData?.data &&
            employeeGoalsTaskData.data.length > 0 ? (
              employeeGoalsTaskData.data.map((task: any) => {
                return (
                  <React.Fragment key={task.taskId}>
                    <tr className="border-t border-gray-200 cursor-pointer hover:bg-gray-50 !border-b-1 !border-[#E8E8EC]">
                      <td className="w-[25%] px-4 py-3">
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
                      <td className="w-[20%] px-4 py-3">
                        <div className="flex justify-center gap-4">
                          <div
                            className="flex gap-2 justify-center"
                            onClick={() => {
                              handleUpdate(task);
                            }}
                          >
                            <Pencil aria-label="Edit" className="w-5 h-5" />
                          </div>
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
                          <div
                            className="flex gap-2 justify-center"
                            onClick={() => {
                              handleDelete({ GOAL_ID, TASK_ID: task.taskId });
                            }}
                          >
                            <Trash2 aria-label="Delete" className="w-5 h-5" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-3 text-[#73737D]">
                  You don't have any tasks against your goal.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <EmployeeGoalTaskUpdate
          handleClose={taskUpdateHandleClose}
          open={taskUpdateOpen}
          GOAL_ID={GOAL_ID || ""}
          TASK_ID={tasGoalskId || ""}
          employeeGoalsTaskData={selectedTask}
        />
        <Drawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          heading="Comments"
        >
          <EmployeeGoalsComment
            GOAL_ID={GOAL_ID || ""}
            TASK_ID={tasGoalskId || ""}
          />
        </Drawer>
      </div>
    </>
  );
};

export default EmployeeGoalTask;
