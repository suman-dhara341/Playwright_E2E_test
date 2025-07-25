import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import {
  useCreateEmployeeTaskMutation,
  useGetEmployeeGoalsQuery,
  useGetEmployeeTaskQuery,
} from "../queries/okrQuery";
import { showToast } from "../../../utilities/toast";
import { EmployeeGoalsTaskCreate } from "../interfaces";
import ThreeDotsLoading from "../../../utilities/ThreeDotsLoading";
import { Modal } from "@mui/material";

interface CreateTaskProps {
  employeeGoalsDetailsRefetch: any;
  GOAL_ID: string;
  open: boolean;
  handleClose: () => void;
}

const validationSchema = Yup.object().shape({
  taskName: Yup.string().required("Task name is required"),
  taskDescription: Yup.string().required("Task description is required"),
});

const EmployeeTaskCreate: React.FC<CreateTaskProps> = ({
  employeeGoalsDetailsRefetch,
  handleClose,
  open,
  GOAL_ID,
}) => {
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const [createTask, { isLoading, isSuccess }] =
    useCreateEmployeeTaskMutation();

  const { refetch } = useGetEmployeeTaskQuery({ ORG_ID, EMP_ID, GOAL_ID });
  const { refetch: employeeGoalsRefetch } = useGetEmployeeGoalsQuery({
    ORG_ID,
    EMP_ID,
  });

  const formik = useFormik<EmployeeGoalsTaskCreate>({
    initialValues: {
      taskName: "",
      taskDescription: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await createTask({
          ORG_ID,
          EMP_ID,
          GOAL_ID,
          taskDetails: values,
        }).unwrap();
        resetForm();
        handleClose();
        employeeGoalsDetailsRefetch();
        employeeGoalsRefetch();
        showToast("Task created successfully", "success");
      } catch (err: any) {
        showToast(err?.data?.message || "Task creation failed", "error");
      }
    },
  });

  useEffect(() => {
    if (isSuccess) {
      refetch();
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
          <p className="font-semibold text-xl text-[#585DF9] mb-1">
            Create Task
          </p>
          <p className="text-xs text-[#878791] mb-3">
            A task is an atomic step that needs to be completed in order to
            achieve the overall goal. Tasks are the smaller, actionable items
            that contribute to progress toward reaching the goal.
          </p>
          <form onSubmit={formik.handleSubmit} className="bg-white w-full">
            {/* Task Name Field */}
            <div className="mb-3">
              <label className="block text-[#73737D] text-base font-semibold">
                Task Name
              </label>
              <p className="text-[#878791] text-xs">
                A brief summary of the task.
              </p>
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
              <p className="text-[#878791] text-xs">
                Give a detailed description of the actions that you need to
                perform to complete the task.
              </p>
              <textarea
                name="taskDescription"
                value={formik.values.taskDescription}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={4}
                className={`w-full p-2 min-h-[75px] border focus-visible:outline-none ${
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
                className="flex items-center justify-center bg-gradient-to-b from-[#7E92F8] py-2 px-4 to-[#6972F0] text-white !rounded-md min-w-[100px]"
              >
                {isLoading ? <ThreeDotsLoading color="white" /> : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default EmployeeTaskCreate;
