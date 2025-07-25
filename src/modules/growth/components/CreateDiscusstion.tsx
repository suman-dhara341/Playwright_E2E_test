import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import {
  useCreateEmployeediscussionMutation,
  useGetEmployeeConversationDetailsQuery,
  useGetEmployeeConversationQuery,
} from "../queries/growthQuery";
import { showToast } from "../../../utilities/toast";
import { DiscussionCreateData } from "../interfaces";
import { Link } from "react-router-dom";
import { Modal } from "@mui/material";

interface CreateDicusstionProps {
  conversationId: any;
  open: boolean;
  handleClose: () => void;
}

const validationSchema = Yup.object().shape({
  overview: Yup.string().required("overview is required"),
});

const CreateDiscusstion: React.FC<CreateDicusstionProps> = ({
  handleClose,
  open,
  conversationId,
}) => {
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const [CreateDiscusstion, { isLoading }] =
    useCreateEmployeediscussionMutation();
  const { refetch: employeeConversationRefetch } =
    useGetEmployeeConversationQuery({ ORG_ID, EMP_ID });
  const { refetch: employeeGrowthConversitionDetailsRefetch } =
    useGetEmployeeConversationDetailsQuery({
      ORG_ID,
      EMP_ID,
      conversationId,
    });

  const formik = useFormik<DiscussionCreateData>({
    initialValues: {
      overview: "",
      createdBy: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await CreateDiscusstion({
          ORG_ID,
          EMP_ID,
          conversationId,
          discussionDetails: values,
        }).unwrap();
        resetForm();
        handleClose();
        employeeConversationRefetch();
        employeeGrowthConversitionDetailsRefetch();
        showToast("Discussion created successfully", "success");
      } catch (err: any) {
        showToast(err?.data?.message || "Discussion creation failed", "error");
      }
    },
  });

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
          <p className="font-semibold text-xl text-[#585DF9]">
            Create Discussion
          </p>
          <p className="mb-3 text-[#878791] text-xs">
            Discussion is a meeting instance with your manager where you talked
            about this growth area. Whenever you have such a discussion, use
            this to keep a record.
          </p>
          <form onSubmit={formik.handleSubmit} className="bg-white w-full">
            {/* Dicusstion Description Field */}
            <div className="mb-3">
              <label className="block text-[#73737D] text-base font-semibold">
                Record Your Discussion
              </label>
              <p className="text-[#878791] text-xs">
                Add a detailed record of the discussion with your Manager for
                future reference. Create{" "}
                <Link to="/goals" className="!text-[#585df9]">
                  Goals
                </Link>{" "}
                for action items and track progress.
              </p>
              <textarea
                name="overview"
                value={formik.values.overview}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={4}
                className={`w-full p-2 min-h-[75px] border focus-visible:outline-none ${
                  formik.touched.overview && formik.errors.overview
                    ? "border-red-500"
                    : "border-[#E8E8EC]"
                } rounded-md mt-2`}
              />
              {formik.touched.overview && formik.errors.overview && (
                <p className="text-red-500 text-sm">{formik.errors.overview}</p>
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
                className="bg-gradient-to-b from-[#7E92F8] py-2 px-4 to-[#6972F0] text-white !rounded-md min-w-[100px] flex justify-center"
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

export default CreateDiscusstion;
