import { useState } from "react";
import { showToast } from "../../../../../utilities/toast";
import { useCreateEmployeeGoalsMutation } from "../../../../goals/queries/okrQuery";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CreateGoal } from "../../../../goals/interfaces";
import { X } from "lucide-react";
import ThreeDotsLoading from "../../../../../utilities/ThreeDotsLoading";

const validationSchema = Yup.object({
  goalName: Yup.string()
    .required("Goal title is required")
    .max(100, "Goal title must be at most 100 characters")
    .test(
      "no-extra-spaces",
      "Goal title cannot have leading, trailing, or multiple spaces",
      value =>
        !!value &&
        value.trim() === value &&
        !/\s{2,}/.test(value)
    ),
  goalDescription: Yup.string()
    .required("Goal description is required")
    .max(300, "Goal description must be at most 300 characters")
    .test(
      "no-extra-spaces",
      "Goal description cannot have leading, trailing, or multiple spaces",
      value =>
        !!value &&
        value.trim() === value &&
        !/\s{2,}/.test(value)
    ),
  tags: Yup.array()
    .of(Yup.string().trim())
    .min(1, "Please add at least one tag"),
  timeline: Yup.string().optional(),
  dueDate: Yup.string().optional(),
});


const AddGoals = ({ nextStep, prevStep, skipStep }: any) => {
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const [createGoalData, { isLoading }] = useCreateEmployeeGoalsMutation();
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  const currentMonth = `${new Date().getFullYear()}-${String(
    new Date().getMonth() + 1
  ).padStart(2, "0")}`;

  const getLastDayOfMonth = (monthStr: string) => {
    const [year, month] = monthStr.split("-").map(Number);
    const lastDay = new Date(year, month, 0).getDate();
    return `${year}-${String(month).padStart(2, "0")}-${String(
      lastDay
    ).padStart(2, "0")}`;
  };

  const formik = useFormik<CreateGoal>({
    initialValues: {
      goalName: "",
      goalDescription: "",
      tags: [],
      dueDate: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const lastDate = getLastDayOfMonth(selectedMonth);
        await createGoalData({
          ORG_ID,
          EMP_ID,
          goalsDetails: {
            ...values,
            dueDate: lastDate,
          },
        }).unwrap();
        resetForm();
        showToast("Goal created successfully", "success");
        nextStep();
      } catch (err) {
        showToast("Goal creation failed", "error");
      }
    },
  });

  const handleNextClick = async () => {
    const isValid = await formik.validateForm();
    formik.setTouched({
      goalName: true,
      goalDescription: true,
      tags: true,
    });

    if (Object.keys(isValid).length === 0) {
      await formik.submitForm();
      nextStep();
    }
  };

  const handleBackClick = () => {
    prevStep();
  };

  const handleSkipClick = () => {
    skipStep();
  };

  return (
    <div>
      <p className="mb-3 font-semibold text-xl text-[#585DF9]">
        Create your first goal
      </p>
      <div>
        <form onSubmit={formik.handleSubmit} className="bg-white w-full">
          <div className="mb-2">
            <label className="block text-[#73737D] text-base font-semibold">
              Goal Title
            </label>
            <p className="text-[#878791] text-xs">
              Character Limit: Max 100 characters
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
          <div className="mb-2">
            <label className="block text-[#73737D] text-base font-semibold">
              Goal Description
            </label>
            <p className="text-[#878791] text-xs">
              Character Limit: Max 300 characters
            </p>
            <textarea
              name="goalDescription"
              value={formik.values.goalDescription}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={4}
              className="w-full p-2 h-[40px] border-1 border-[#E8E8EC] rounded-md mt-2 min-h-[75px] outline-none focus-visible:outline-none"
            />
            {formik.touched.goalDescription &&
              formik.errors.goalDescription && (
                <p className="text-red-500 text-sm">
                  {formik.errors.goalDescription}
                </p>
              )}
          </div>
          <div className="flex gap-3 mb-2">
            <div className="w-full">
              <label className="block text-[#73737D] text-base font-semibold">
                Tags
              </label>
              <p className="text-[#878791] text-xs">
                Select: Min 1 item
              </p>
              <div
                className="w-full min-h-[40px] p-2 border-1 !border-[#E8E8EC] rounded-md mt-2 flex flex-wrap items-center gap-2"
                onClick={() => {
                  const input = document.getElementById("tag-input");
                  if (input) input.focus();
                }}
              >
                {formik.values.tags.map((tag, index) => (
                  <div className="flex items-center gap-2 bg-[#F4F6F8] py-[2px] px-[8px] rounded">
                    <span
                      key={index}
                      className="text-xs text-[#858EAD] font-semibold"
                    >
                      {tag}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updatedTags = [...formik.values.tags];
                        updatedTags.splice(index, 1);
                        formik.setFieldValue("tags", updatedTags);
                      }}
                      className="ml-2 text-[#585DF9] hover:text-blue-700 font-bold"
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
                  {formik.errors.tags}
                </p>
              )}
            </div>
            <div className="w-full">
              <label className="block text-[#73737D] text-base font-semibold">
                Target Date
              </label>
              <p className="text-[#878791] text-xs">
                Character Limit: Max 20 characters
              </p>
              <input
                type="month"
                name="dueDate"
                value={selectedMonth}
                min={currentMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full p-2 h-[40px] border-1 border-[#E8E8EC] rounded-md mt-2 focus-visible:outline-none"
              />
            </div>
          </div>
        </form>
      </div>
      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={handleBackClick}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Back
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSkipClick}
            className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
          >
            Next
          </button>

          <button
            type="button"
            onClick={handleNextClick}
            className="bg-gradient-to-b from-[#7E92F8] py-2 px-4 to-[#6972F0] text-white !rounded-md min-w-[100px] flex justify-center"
          >
            {isLoading ? <ThreeDotsLoading color="white" /> : "Create Goal"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddGoals;
