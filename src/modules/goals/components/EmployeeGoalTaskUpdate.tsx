import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import {
  useGetEmployeeGoalsDetailsQuery,
  useGetEmployeeGoalsQuery,
  useGetEmployeeTaskQuery,
  useUpdateEmployeeTaskMutation,
} from "../queries/okrQuery";
import { showToast } from "../../../utilities/toast";
import { EmployeeGoalsTaskUpdate } from "../interfaces";
import { Modal } from "@mui/material";

interface UpdateTaskProps {
  GOAL_ID: string;
  open: boolean;
  TASK_ID: string;
  handleClose: () => void;
  employeeGoalsTaskData: any;
}

const validationSchema = Yup.object().shape({
  taskName: Yup.string().required("Task name is required"),
  taskDescription: Yup.string().required("Task description is required"),
  status: Yup.string().required("Task status is required"),
});

const EmployeeGoalTaskUpdate: React.FC<UpdateTaskProps> = ({
  handleClose,
  open,
  GOAL_ID,
  TASK_ID,
  employeeGoalsTaskData,
}) => {
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const [updateTask, { isLoading, isSuccess }] =
    useUpdateEmployeeTaskMutation();
  const { refetch: employeeGoalsRefetch } = useGetEmployeeGoalsQuery({
    ORG_ID,
    EMP_ID,
  });
  const { refetch } = useGetEmployeeTaskQuery({ ORG_ID, EMP_ID, GOAL_ID });
  const { refetch: employeeGoalsDetailsRefetch } =
    useGetEmployeeGoalsDetailsQuery({ ORG_ID, EMP_ID, GOAL_ID });

  const formik = useFormik<EmployeeGoalsTaskUpdate>({
    initialValues: {
      taskName: "",
      taskDescription: "",
      status: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await updateTask({
          ORG_ID,
          EMP_ID,
          GOAL_ID,
          TASK_ID,
          taskDetails: values,
        }).unwrap();
        resetForm();
        handleClose();
        employeeGoalsRefetch();
        showToast("Task updated successfully", "success");
      } catch (err: any) {
        showToast(err?.data?.message || "Task update failed", "error");
      }
    },
  });

  useEffect(() => {
    if (employeeGoalsTaskData) {
      const { taskName, taskDescription, status } = employeeGoalsTaskData;
      formik.setValues({
        taskName: taskName || "",
        taskDescription: taskDescription || "",
        status: status || "",
      });
    }
  }, [employeeGoalsTaskData]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      employeeGoalsDetailsRefetch();
    }
  }, [isSuccess]);

  if (!open) return null;

  return (
    <Modal
      open
      onClose={handleClose}
      aria-labelledby="recognition-modal-title"
      aria-describedby="recognition-modal-description"
      className="flex items-center justify-center border-0"
    >
      <div className="bg-white p-6 rounded-md shadow-lg w-[40%]">
        <div
          className="z-1 min-h-[calc(100vh-730px)] overflow-y-auto"
          onClick={(event) => event.stopPropagation()}
        >
          <p className="mb-3 font-semibold text-xl text-[#585DF9]">
            Update Employee Task
          </p>
          <form onSubmit={formik.handleSubmit} className="bg-white w-full">
            {/* Task Name Field */}
            <div className="mb-3">
              <label className="block text-[#73737D] text-base font-semibold">
                Task Name
              </label>
              <input
                type="text"
                name="taskName"
                value={formik.values.taskName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full p-2 h-[40px] border focus-visible:outline-none ${
                  formik.touched.taskName && formik.errors.taskName
                    ? "border-red-500"
                    : "border-[#E8E8EC]"
                } rounded-md mt-2`}
              />
              {formik.touched.taskName && formik.errors.taskName && (
                <p className="text-red-500 text-sm">{formik.errors.taskName}</p>
              )}
            </div>

            {/* Task Description Field */}
            <div className="mb-3">
              <label className="block text-[#73737D] text-base font-semibold">
                Task Description
              </label>
              <textarea
                name="taskDescription"
                value={formik.values.taskDescription}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={4}
                className={`w-full p-2 min-h-[75px] border ${
                  formik.touched.taskDescription &&
                  formik.errors.taskDescription
                    ? "border-red-500"
                    : "border-[#E8E8EC]"
                } rounded-md mt-2`}
              />
              {formik.touched.taskDescription &&
                formik.errors.taskDescription && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.taskDescription}
                  </p>
                )}
            </div>

            {/* Task Status Field */}
            <div className="mb-3">
              <label className="block text-[#73737D] text-base font-semibold">
                Task Status
              </label>
              <select
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full p-2 h-[40px] border ${
                  formik.touched.status && formik.errors.status
                    ? "border-red-500"
                    : "border-[#E8E8EC]"
                } rounded-md mt-2`}
              >
                <option value="" disabled>
                  Select Status
                </option>
                <option value="DEFERRED">DEFERRED</option>
                <option value="NOT STARTED">NOT STARTED</option>
                <option value="IN PROGRESS">IN PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
              {formik.touched.status && formik.errors.status && (
                <p className="text-red-500 text-sm">{formik.errors.status}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between gap-2 mt-4">
              <button
                type="button"
                onClick={handleClose}
                className="text-[#E33535] py-2 px-4 border-[#E33535] border-[1px] !rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-b from-[#7E92F8] py-2 px-4 to-[#6972F0] text-white !rounded-md min-w-[100px]"
              >
                {isLoading ? "Submiting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default EmployeeGoalTaskUpdate;
