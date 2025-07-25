import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { useRequestForApprovalMutation } from "../queries/okrQuery";
import { showToast } from "../../../utilities/toast";
import { ApprovalRequest } from "../interfaces";
import { useGetProfileQuery } from "../../profile/queries/profileQuery";
import { Modal } from "@mui/material";

const validationSchema = Yup.object().shape({
  message: Yup.string().required("Message is required"),
});

const EmployeeApprovalRequestModal: React.FC<any> = ({
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
  const { data: profile } = useGetProfileQuery({ ORG_ID, EMP_ID });

  const MANAGER_ID = profile?.data?.reportsTo;
  const [
    createApprovalRequest,
    { isLoading: approvalRequesIsLoading, isSuccess: approvalRequesIsSuccess },
  ] = useRequestForApprovalMutation();

  const formik = useFormik<ApprovalRequest>({
    initialValues: {
      managerId: MANAGER_ID,
      message: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await createApprovalRequest({
          ORG_ID,
          EMP_ID,
          GOAL_ID,
          approvalData: values,
        }).unwrap();
        resetForm();
        handleClose();
        showToast("Task created successfully", "success");
      } catch (err: any) {
        showToast(err?.data?.message || "Task creation failed", "error");
      }
    },
  });

  useEffect(() => {
    if (approvalRequesIsSuccess) {
      employeeGoalsDetailsRefetch();
    }
  }, [approvalRequesIsSuccess]);

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
            Approval Request
          </p>
          <form onSubmit={formik.handleSubmit} className="bg-white w-full">
            {/* Task Description Field */}
            <div className="mb-3">
              <label className="block text-[#73737D] text-base font-semibold">
                Enter Your Message
              </label>
              <textarea
                name="message"
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={4}
                className={`w-full p-2 min-h-[75px] border ${
                  formik.touched.message && formik.errors.message
                    ? "border-red-500"
                    : "border-[#E8E8EC]"
                } rounded-md mt-2`}
              />
              {formik.touched.message && formik.errors.message && (
                <p className="text-red-500 text-sm">{formik.errors.message}</p>
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
                disabled={approvalRequesIsLoading}
                className="bg-gradient-to-b from-[#7E92F8] py-2 px-4 to-[#6972F0] text-white !rounded-md min-w-[100px] flex justify-center"
              >
                {approvalRequesIsLoading ? "Submiting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default EmployeeApprovalRequestModal;
