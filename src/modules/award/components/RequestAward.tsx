import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLazyAwardRequestQuery } from "../queries/awardQuery";
import { useFormik } from "formik";
import * as Yup from "yup";
import { showToast } from "../../../utilities/toast";
import ThreeDotsLoading from "../../../utilities/ThreeDotsLoading";
import ReactQuill from "react-quill";
import { Modal } from "@mui/material";

const awardRequestvalidationSchema = Yup.object().shape({
  description: Yup.string()
    .trim()
    .test(
      "not-empty",
      "Description cannot be empty or only spaces",
      (value) => !!value && value.trim().length > 0
    )
    .required("Description is required"),
});

export const RequestAward = ({
  onClose,
  awardId,
  awardDetailsRefetch,
}: {
  onClose: () => void;
  awardId: string;
  awardDetailsRefetch: any;
}) => {
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const quillRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [awardRequest, { isLoading }] = useLazyAwardRequestQuery();
  const formik = useFormik({
    initialValues: {
      description: "",
      requestedBy: EMP_ID,
    },
    validationSchema: awardRequestvalidationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        await awardRequest({
          ORG_ID,
          awardId,
          requestDescription: values,
        }).unwrap();
        awardDetailsRefetch();
        resetForm();
        onClose();
        showToast("Successfully request for award", "success");
      } catch (error: any) {
        showToast(error?.data?.message || "Failed to request award", "error");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleQuillChange = (content: string) => {
    const strippedContent = content.replace(/<(.|\n)*?>/g, "").trim();
    formik.setFieldValue("description", strippedContent ? content : "");
  };

  return (
    <Modal
      open
      onClose={onClose}
      aria-labelledby="recognition-modal-title"
      aria-describedby="recognition-modal-description"
      className="flex items-center justify-center border-0"
    >
      <div
        className="bg-white rounded-md shadow-lg w-[40%] overflow-hidden p-3"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <p className="text-[#878791] text-xs">
          Celebrate your team’s awesomeness – request an award today!
        </p>
        <p className="font-semibold text-lg text-[#585DF9] my-2">
          Request Award
        </p>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <p className="text-base font-semibold text-[#73737D]">Evidence</p>
            <p className="text-sm text-[#878791] ">
              Enter detailed criteria for earning this award. Specify measurable
              actions, behaviors, or contributions (e.g., 'Exceeds project
              deadlines while maintaining high-quality work')
            </p>
            <div className="mt-2 min-h-[160px]">
              <ReactQuill
                theme="snow"
                value={formik.values.description}
                onChange={handleQuillChange}
                ref={quillRef}
                className="mt-2"
                style={{ height: "150px" }}
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
            </div>

            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.description}
              </p>
            )}
          </div>

          <div className="flex  justify-between gap-0 mt-4">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onClose();
              }}
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
    </Modal>
  );
};
export default RequestAward;
