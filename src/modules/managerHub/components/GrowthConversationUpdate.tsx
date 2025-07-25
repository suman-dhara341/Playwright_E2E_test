import React, { useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { useUpdateEmployeeConversationMutation } from "../../growth/queries/growthQuery";
import { X } from "lucide-react";
import { showToast } from "../../../utilities/toast";
import ThreeDotsLoading from "../../../utilities/ThreeDotsLoading";
import ReactQuill from "react-quill";
import { Modal } from "@mui/material";

interface UpdateConversationProps {
  employeeId: any;
  open: boolean;
  handleClose: () => void;
  MANAGER_ID: any;
  editConversation: any;
  employeeConversationRefetch: any;
}

interface ConversationFormValues {
  conversationTitle: string;
  description: string;
  growthAreas: string[];
}

const validationSchema = Yup.object({
  conversationTitle: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  growthAreas: Yup.array()
    .min(1, "Please add at least one growth area")
    .of(Yup.string()),
});

const GrowthConversationUpdate: React.FC<UpdateConversationProps> = ({
  employeeId,
  handleClose,
  open,
  MANAGER_ID,
  editConversation,
  employeeConversationRefetch,
}) => {
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = employeeId;
  const quillRef = useRef(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [updateConversation, { isLoading }] =
    useUpdateEmployeeConversationMutation();

  const formik = useFormik<ConversationFormValues>({
    enableReinitialize: true,
    initialValues: {
      conversationTitle: editConversation?.conversationTitle || "",
      description: editConversation?.conversationInfo?.description || "",
      growthAreas: editConversation?.conversationInfo?.growthAreas || [],
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await updateConversation({
          ORG_ID: ORG_ID,
          EMP_ID: EMP_ID,
          conversationId: editConversation?.conversationId,
          conversationDetails: {
            conversationId: editConversation?.conversationId,
            employeeId: EMP_ID,
            managerId: MANAGER_ID,
            conversationTitle: values.conversationTitle,
            conversationInfo: {
              description: values.description,
              growthAreas: values.growthAreas,
            },
          },
        }).unwrap();
        resetForm();
        handleClose();
        employeeConversationRefetch();
        showToast("Conversation updated successfully", "success");
      } catch (err: any) {
        showToast(
          err?.data?.message || "Failed to update conversation",
          "error"
        );
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
          className="z-1 min-h-[calc(100vh-530px)] overflow-y-auto"
          onClick={(event) => event.stopPropagation()}
        >
          <p className="mb-3 font-semibold text-xl text-[#585DF9]">
            Update Employee Conversation
          </p>
          <form onSubmit={formik.handleSubmit} className="bg-white w-full">
            {/* Title */}
            <div className="mb-3">
              <label className="block text-[#73737D] text-base font-semibold">
                Title
              </label>
              <p className="text-[#878791] text-xs">
                Character Limit: Max 50 characters
              </p>
              <input
                type="text"
                name="conversationTitle"
                value={formik.values.conversationTitle}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 h-[40px] border border-[#E8E8EC] rounded-md mt-2 focus-visible:outline-none"
              />
              {formik.touched.conversationTitle &&
                formik.errors.conversationTitle && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.conversationTitle}
                  </p>
                )}
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="block text-[#73737D] text-base font-semibold">
                Description
              </label>
              <p className="text-[#878791] text-xs">
                Character Limit: Max 200 characters
              </p>
              <ReactQuill
                theme="snow"
                value={formik.values.description}
                onChange={(description) =>
                  formik.setFieldValue("description", description)
                }
                ref={quillRef}
                className="mt-2 mb-3 h-40"
                modules={{
                  toolbar: [
                    [{ header: "1" }, { header: "2" }, { font: [] }],
                    [{ size: [] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [
                      { list: "ordered" },
                      { list: "bullet" },
                      { indent: "-1" },
                      { indent: "+1" },
                    ],
                    ["link"],
                  ],
                }}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-red-500 text-sm">
                  {formik.errors.description}
                </p>
              )}
            </div>

            {/* Growth Areas */}
            <div className="mb-3">
              <label className="block text-[#73737D] text-base font-semibold">
                Growth Areas
              </label>
              <p className="text-[#878791] text-xs">
                Character Limit: Max 20 characters
              </p>
              <div
                className="w-full min-h-[40px] p-2 border border-[#E8E8EC] rounded-md mt-2 flex flex-wrap items-center gap-2"
                onClick={() => {
                  const input = document.getElementById("growth-input");
                  input?.focus();
                }}
              >
                {formik.values.growthAreas.map((area, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-[#F4F6F8] py-[2px] px-[8px] rounded"
                  >
                    <span className="text-xs text-[#858EAD] font-semibold">
                      {area}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...formik.values.growthAreas];
                        updated.splice(index, 1);
                        formik.setFieldValue("growthAreas", updated);
                      }}
                    >
                      <X className="w-3 h-3 text-[#858EAD]" />
                    </button>
                  </div>
                ))}
                <input
                  id="growth-input"
                  type="text"
                  placeholder="Add"
                  className="flex-grow min-w-[100px] outline-none focus-visible:outline-none"
                  onKeyDown={(e) => {
                    const input = e.currentTarget.value.trim();
                    if (["Enter", ",", " "].includes(e.key)) {
                      e.preventDefault();
                      if (input && !formik.values.growthAreas.includes(input)) {
                        formik.setFieldValue("growthAreas", [
                          ...formik.values.growthAreas,
                          input,
                        ]);
                        e.currentTarget.value = "";
                      }
                    }
                  }}
                />
              </div>
              {formik.touched.growthAreas && formik.errors.growthAreas && (
                <p className="text-sm text-red-500 mt-1">
                  {formik.errors.growthAreas}
                </p>
              )}
            </div>

            {/* Buttons */}
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

export default GrowthConversationUpdate;
