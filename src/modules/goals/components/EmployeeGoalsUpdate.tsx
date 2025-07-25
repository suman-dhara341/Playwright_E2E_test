import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import {
  useUpdateEmployeeGoalsMutation,
  useGetEmployeeGoalsQuery,
} from "../queries/okrQuery";
import { UpdateGoal } from "../interfaces";
import { showToast } from "../../../utilities/toast";
import { X } from "lucide-react";
import ThreeDotsLoading from "../../../utilities/ThreeDotsLoading";
import { Modal } from "@mui/material";

interface UpdateGoalProps {
  employeeGoalsDetailsData: any;
  open: boolean;
  handleClose: () => void;
  employeeGoalsDetailsRefetch: any;
}

const validationSchema = Yup.object({
  goalName: Yup.string().required("Goal title is required"),
  goalDescription: Yup.string().required("Goal description is required"),
  tags: Yup.array().min(1, "Please add at least one tag").of(Yup.string()),
  dueDate: Yup.string().optional(),
});

const EmployeeGoalsUpdate: React.FC<UpdateGoalProps> = ({
  employeeGoalsDetailsData,
  employeeGoalsDetailsRefetch,
  handleClose,
  open,
}) => {
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const [updateGoalData, { isLoading, isSuccess }] =
    useUpdateEmployeeGoalsMutation();
  const { refetch } = useGetEmployeeGoalsQuery({ ORG_ID, EMP_ID });
  const currentMonth = `${new Date().getFullYear()}-${String(
    new Date().getMonth() + 1
  ).padStart(2, "0")}`;
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const dueDate = employeeGoalsDetailsData?.dueDate;
    if (dueDate) {
      const date = new Date(dueDate);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
    }
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  useEffect(() => {
    if (employeeGoalsDetailsData?.dueDate) {
      const date = new Date(employeeGoalsDetailsData.dueDate);
      setSelectedMonth(
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      );
    }
  }, [employeeGoalsDetailsData?.dueDate]);

  const getLastDayOfMonth = (monthStr: string) => {
    const [year, month] = monthStr.split("-").map(Number);
    const lastDay = new Date(year, month, 0).getDate();
    return `${year}-${String(month).padStart(2, "0")}-${String(
      lastDay
    ).padStart(2, "0")}`;
  };

  const formik = useFormik<UpdateGoal>({
    enableReinitialize: true,
    initialValues: {
      orgId_employeeId: employeeGoalsDetailsData?.orgId_employeeId || "",
      goalId: employeeGoalsDetailsData?.goalId || "",
      goalName: employeeGoalsDetailsData?.title || "",
      goalDescription: employeeGoalsDetailsData?.description || "",
      tags: employeeGoalsDetailsData?.tags || [],
      dueDate: selectedMonth
        ? selectedMonth
        : employeeGoalsDetailsData?.dueDate || "",
      status: employeeGoalsDetailsData?.status || "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const formattedDueDate = getLastDayOfMonth(selectedMonth);
      const payload = {
        ...values,
        dueDate: formattedDueDate,
      };
      try {
        await updateGoalData({
          GOAL_ID: values.goalId,
          EMP_ID,
          ORG_ID,
          goalsDetails: payload,
        }).unwrap();
        showToast("Goal updated successfully", "success");
        resetForm();
        handleClose();
        employeeGoalsDetailsRefetch();
      } catch (err: any) {
        showToast(err?.data?.message || "Goal operation failed", "error");
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
      className="flex items-center justify-center border-0"
    >
      <div className="bg-white p-6 rounded-md shadow-lg w-[40%]">
        <div
          className="z-1 min-h-[calc(100vh-330px)] overflow-y-auto"
          onClick={(event) => event.stopPropagation()}
        >
          <p className="mb-3 font-semibold text-xl text-[#585DF9]">
            Update Employee Goal
          </p>
          <form onSubmit={formik.handleSubmit} className=" bg-white w-full">
            <div className="mb-3">
              <label className="block text-[#73737D] text-base font-semibold">
                Goal Title
              </label>
              <p className="text-[#878791] text-xs">
                Character Limit: Max 50 characters
              </p>
              <input
                type="text"
                name="goalName"
                value={formik.values.goalName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 h-[40px] border-1 border-[#E8E8EC] rounded-md mt-2 focus-visible:outline-none"
              />
              {formik.touched.goalName && formik.errors.goalName && (
                <p className="text-red-500 text-sm">{formik.errors.goalName}</p>
              )}
            </div>

            <div className="mb-3">
              <label className="block text-[#73737D] text-base font-semibold">
                Goal Description
              </label>
              <p className="text-[#878791] text-xs">
                Character Limit: Max 200 characters
              </p>
              <textarea
                name="goalDescription"
                value={formik.values.goalDescription}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={4}
                className="w-full p-2 h-[40px] border-1 border-[#E8E8EC] rounded-md mt-2 min-h-[75px]"
              />
              {formik.touched.goalDescription &&
                formik.errors.goalDescription && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.goalDescription}
                  </p>
                )}
            </div>

            <div className="mb-3">
              <label className="block text-[#73737D] text-base font-semibold">
                Tags
              </label>
              <p className="text-[#878791] text-xs">
                Character Limit: Max 20 characters
              </p>
              <div
                className="w-full min-h-[40px] p-2 border-1 !border-[#E8E8EC] rounded-md mt-2 flex flex-wrap items-center gap-2"
                onClick={() => {
                  const input = document.getElementById("tag-input");
                  if (input) input.focus();
                }}
              >
                {formik.values.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-[#F4F6F8] py-[2px] px-[8px] rounded"
                  >
                    <span className="text-xs text-[#858EAD] font-semibold">
                      {tag}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updatedTags = [...formik.values.tags];
                        updatedTags.splice(index, 1);
                        formik.setFieldValue("tags", updatedTags);
                      }}
                    >
                      <X className="w-3 h-3 text-[#858EAD]" />
                    </button>
                  </div>
                ))}
                <input
                  id="tag-input"
                  type="text"
                  placeholder="Add a tag"
                  className="flex-grow min-w-[100px] outline-none focus-visible:outline-none"
                  onKeyDown={(e) => {
                    const input = e.currentTarget.value.trim();
                    if (e.key === " " || e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      if (input && !formik.values.tags.includes(input)) {
                        formik.setFieldValue("tags", [
                          ...formik.values.tags,
                          input,
                        ]);
                        e.currentTarget.value = "";
                      }
                    }
                  }}
                />
              </div>
              {formik.touched.tags && formik.errors.tags && (
                <p className="text-sm text-red-500 mt-1">
                  {formik.errors.tags as string}
                </p>
              )}
            </div>

            <div className="mb-3">
              <label className="block text-[#73737D] text-base font-semibold">
                Target Date
              </label>
              <input
                type="month"
                name="dueDate"
                value={selectedMonth}
                min={currentMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full p-2 h-[40px] border-1 border-[#E8E8EC] rounded-md mt-2 focus-visible:outline-none"
              />
            </div>

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
                className="bg-gradient-to-b from-[#7E92F8] py-2 px-4 to-[#6972F0] text-white !rounded-md min-w-[100px] flex justify-center"
              >
                {isLoading ? <ThreeDotsLoading color="white" /> : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default EmployeeGoalsUpdate;
