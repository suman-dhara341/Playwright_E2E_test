import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  useCreateAwardMutation,
  useGetAwardsQuery,
} from "../queries/awardQuery";
import { useFormik } from "formik";
import * as Yup from "yup";
import { showToast } from "../../../utilities/toast";
import ReactQuill from "react-quill";
import ThreeDotsLoading from "../../../utilities/ThreeDotsLoading";
import CropperComponent from "./CropperComponent";
import { Modal } from "@mui/material";

const validationSchema = Yup.object().shape({
  awardName: Yup.string()
    .trim()
    .strict()
    .max(50, "Award Name must be at most 50 characters")
    .required("Award Name is required")
    .label("Award Name"),
  description: Yup.string().trim().strict().required("Description is required"),
  criteria: Yup.string().trim().strict().required("Criteria is required"),
  moderators: Yup.array()
    .of(Yup.string())
    .min(1, "At least one moderator is required"),
  awardImageContent: Yup.string().required("Award image is required"),
});

type CreateAwardProps = {
  close: () => void;
};

const CreateAward = ({ close }: CreateAwardProps) => {
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );

  const quillRef = useRef(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [openCropper, setOpenCropper] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [croppedImageBase64, setCroppedImageBase64] = useState<string>("");
  const [createAward, { isLoading }] = useCreateAwardMutation();
  const { refetch } = useGetAwardsQuery({ ORG_ID, nextToken: null });
  const formik = useFormik({
    initialValues: {
      awardName: "",
      description: "",
      criteria: "",
      moderators: [EMP_ID],
      awardPhoto: "",
      awardImageContent: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {
          ...values,
          awardImageContent: croppedImageBase64,
        };

        await createAward({
          ORG_ID,
          newAward: payload,
        }).unwrap();

        resetForm();
        close();
        refetch();
        showToast("Award created successfully", "success");
      } catch (error: any) {
        showToast(error?.data?.message || "Award creation failed", "error");
      }
    },
  });

  useEffect(() => {
    if (croppedImageBase64) {
      formik.setFieldValue("awardImageContent", croppedImageBase64);
    }
  }, [croppedImageBase64]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openCropper) return; // Don't close if cropper modal is open

      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [close, openCropper]);

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <Modal
      open
      onClose={close}
      disableEnforceFocus
      aria-labelledby="recognition-modal-title"
      aria-describedby="recognition-modal-description"
      className="flex items-center justify-center border-0"
    >
      <div
        ref={modalRef}
        className="bg-white pl-6 py-4 rounded-md shadow-lg w-[40%]"
      >
        <div
          className="flex flex-col z-[1001] pr-6 max-h-[calc(100vh-200px)] overflow-auto"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold text-lg text-[#585DF9]">Create Award</p>
            <p className="text-xs text-[#878791] flex flex-row gap-1 ">
              Fields marked with
              <span className="text-sm text-red-500">*</span>are important
            </p>
          </div>
          <p className="text-xs text-[#878791]">
            An insignia or symbol that will be given to honor someone's
            achievements, contributions, or excellence.
          </p>
          <form onSubmit={formik.handleSubmit} className=" bg-white w-full">
            {/* Award Name */}
            <label className="block text-[#73737D] text-base font-semibold mt-3">
              Award Name <span className="text-red-500 text-sm">*</span>
            </label>
            <p className="text-[#878791] text-xs">
              Character Limit: Max 50 characters
            </p>
            <input
              type="text"
              className="w-full p-2 h-[40px] border-1 border-[#E8E8EC] rounded-md mt-2 focus-visible:outline-none"
              {...formik.getFieldProps("awardName")}
            />
            {formik.touched.awardName && formik.errors.awardName && (
              <p className="text-red-500 text-sm">
                {capitalize(formik.errors.awardName)}
              </p>
            )}

            {/* Description */}
            <label className="block text-[#73737D] text-base font-semibold mt-3">
              Description <span className="text-red-500 text-sm">*</span>
            </label>
            <p className="text-[#878791] text-xs">
              Briefly describe the award in 1-2 sentences
            </p>
            <textarea
              className="w-full h-20 p-1 border-1 border-[#E8E8EC] rounded-md mt-2 focus-visible:outline-none"
              {...formik.getFieldProps("description")}
            ></textarea>
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-sm">
                {capitalize(formik.errors.description)}
              </p>
            )}

            {/* Criteria */}
            <div className="mb-2">
              <label className="block text-[#73737D] text-base font-semibold mt-3">
                Criteria <span className="text-red-500 text-sm">*</span>
              </label>
              <p className="text-[#878791] text-xs">
                Enter detailed criteria for earning this award.
              </p>
              <ReactQuill
                theme="snow"
                value={formik.values.criteria}
                onChange={(content) =>
                  formik.setFieldValue("criteria", content)
                }
                ref={quillRef}
                className="mt-2 mb-4 h-37"
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
              {formik.touched.criteria && formik.errors.criteria && (
                <p className="text-red-500 text-sm">
                  {capitalize(formik.errors.criteria)}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <label className="block text-[#73737D] text-base font-semibold mt-2">
              Upload Award Image <span className="text-red-500 text-sm">*</span>
            </label>
            <p className="text-[#878791] text-xs">
              The image should clearly convey the purpose of this award
            </p>
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-2 w-[50%] h-auto object-cover"
              />
            )}
            {previewImage ? (
              <button
                type="button"
                onClick={() => setOpenCropper(true)}
                className="mt-2 border-1 border-[#585DF9] text-[#585DF9] px-3 py-2 rounded text-sm"
              >
                Change Award Image
              </button>
            ) : (
              <label
                onClick={() => setOpenCropper(true)}
                className="w-full py-[50px] mt-2 flex flex-col items-center justify-center border-2 border-dashed border-[#587BAE] rounded-md text-center cursor-pointer"
              >
                <p id="file" className="text-[#73737D]">
                  Click to select a file
                </p>
                <p className="text-sm text-[#73737D]">Only JPG & PNG allowed</p>
              </label>
            )}

            {formik.touched.awardImageContent &&
              formik.errors.awardImageContent && (
                <p className="text-red-500 text-sm">
                  {capitalize(formik.errors.awardImageContent)}
                </p>
              )}
            <Modal
              open={openCropper}
              onClose={() => setOpenCropper(false)}
              disableEnforceFocus
              disableAutoFocus
            >
              <CropperComponent
                openModal={openCropper}
                handleClose={() => setOpenCropper(false)}
                setPreview={setPreviewImage}
                setCroppedImage={setCroppedImageBase64}
              />
            </Modal>

            {/* Buttons */}
            <div className="flex justify-between gap-2 mt-6">
              <button
                type="button"
                onClick={close}
                className="text-[#E33535] py-2 px-4 border-[#E33535] border-[1px] !rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-b from-[#7E92F8] py-2 px-4 to-[#6972F0] text-white !rounded-md min-w-[130px] flex justify-center"
                id="publish_award_button"
              >
                {isLoading ? (
                  <ThreeDotsLoading color="white" />
                ) : (
                  "Publish Award"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default CreateAward;
