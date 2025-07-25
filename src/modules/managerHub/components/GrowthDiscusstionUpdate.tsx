import React, { useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import {
  useGetEmployeeConversationDetailsQuery,
  useGetEmployeeConversationQuery,
  useUpdateEmployeediscussionMutation,
} from "../../growth/queries/growthQuery";
import { showToast } from "../../../utilities/toast";
import { DiscussionUpdateData } from "../../growth/interfaces";
import { Modal } from "@mui/material";

interface UpdateDicusstionProps {
  employeeId: any;
  discussionData: any;
  discussionId: any;
  conversationId: any;
  open: boolean;
  handleClose: () => void;
}

const validationSchema = Yup.object().shape({
  overview: Yup.string().required("overview is required"),
});

const GrowthDiscusstionUpdate: React.FC<UpdateDicusstionProps> = ({
  employeeId,
  discussionData,
  discussionId,
  handleClose,
  open,
  conversationId,
}) => {
  const EMP_ID = employeeId;
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [UpdateDiscusstion, { isLoading }] =
    useUpdateEmployeediscussionMutation();

  const { refetch: employeeConversationRefetch } =
    useGetEmployeeConversationQuery({ ORG_ID, EMP_ID });
  const { refetch: employeeGrowthConversitionDetailsRefetch } =
    useGetEmployeeConversationDetailsQuery({
      ORG_ID,
      EMP_ID,
      conversationId,
    });

  const formik = useFormik<DiscussionUpdateData>({
    initialValues: {
      overview: discussionData?.overview || "",
      discussionId: discussionId,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await UpdateDiscusstion({
          ORG_ID,
          EMP_ID,
          conversationId,
          discussionId,
          discussionDetails: values,
        }).unwrap();
        resetForm();
        handleClose();
        employeeConversationRefetch();
        employeeGrowthConversitionDetailsRefetch();
        showToast("Discussion updated successfully", "success");
      } catch (err: any) {
        showToast(err?.data?.message || "Discussion update failed", "error");
      }
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose]);

  if (!open) return null;

  return (
    <Modal
      open
      onClose={handleClose}
      aria-labelledby="recognition-modal-title"
      aria-describedby="recognition-modal-description"
      className="flex items-center justify-center border-0"
    >
      <div className="bg-white p-6 rounded-md shadow-lg w-[40%]" ref={modalRef}>
        <div
          className="z-1 min-h-[calc(100vh-730px)] overflow-y-auto"
          onClick={(event) => event.stopPropagation()}
        >
          <p className="mb-3 font-semibold text-xl text-[#585DF9]">
            Update Discussion
          </p>
          <form onSubmit={formik.handleSubmit} className="bg-white w-full">
            <div className="mb-3">
              <label className="block text-[#73737D] text-base font-semibold">
                Enter Your Dicusstion
              </label>
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

export default GrowthDiscusstionUpdate;
