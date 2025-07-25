import { useState, useRef, useEffect } from "react";
import { Modal } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { showToast } from "../../../utilities/toast";
import ReactQuill from "react-quill";
import CropperComponent from "./CropperComponent";
import { useCreateAwardMutation } from "../queries/awardQuery";

type Props = {
  award: any;
  open: boolean;
  onClose: () => void;
  onSubmit: (updatedAward: any) => void;
  awardRefetch: ()=> void;
};

const validationSchema = Yup.object({
  awardName: Yup.string()
    .max(50, "Award name must be at most 50 characters")
    .required("Award name is required"),
  description: Yup.string().required("Description is required"),
  criteria: Yup.string().required("Criteria is required"),
  awardImageContent: Yup.string().when(["awardPhoto"], {
    is: (awardPhoto: string) => !awardPhoto || awardPhoto.trim() === "",
    then: (schema) => schema.required("Award image is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const AddToOrgModal = ({ award, open, onClose, onSubmit,awardRefetch }: Props) => {
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );

  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );

  const quillRef = useRef(null);
  const [openCropper, setOpenCropper] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [croppedImageBase64, setCroppedImageBase64] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [createAward] = useCreateAwardMutation();

  useEffect(() => {
    if (award?.awardPhoto) {
      setPreviewImage(award.awardPhoto);
    }
  }, [award]);

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const formik = useFormik({
    initialValues: {
      marketplaceAwardId: award.awardId,
      awardName: award.awardName || "",
      description: award.description || "",
      criteria: award.criteria || "",
      moderators: [EMP_ID],
      awardPhoto: award.awardPhoto,
      awardImageContent: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log(values);

      try {
        setLoading(true);
        const payload = {
          ...values,
          awardImageContent: croppedImageBase64 || values.awardPhoto || "",
          awardPhoto: croppedImageBase64 ? "" : values.awardPhoto,
        };
        await createAward({
          ORG_ID,
          newAward: payload,
        });

        onSubmit(payload);
        showToast("Award created successfully", "success");
        awardRefetch();
        resetForm();
        onClose();
      } catch (error: unknown) {
        console.error("Award creation error:", error);
        showToast("Award creation failed", "error");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      disableEnforceFocus
      aria-labelledby="recognition-modal-title"
      aria-describedby="recognition-modal-description"
      className="flex items-center justify-center border-0"
    >
      <div className="bg-white pl-6 py-4 rounded-md shadow-lg w-[40%]">
        <div className="flex flex-col z-[1001] pr-6 max-h-[calc(100vh-200px)] overflow-auto">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold text-lg text-[#585DF9]">Create Award</p>
            <p className="text-xs text-[#878791] flex flex-row gap-1">
              Fields marked with
              <span className="text-sm text-red-500">*</span>are important
            </p>
          </div>
          <p className="text-xs text-[#878791]">
            An insignia or symbol that will be given to honor someone's
            achievements, contributions, or excellence.
          </p>
          <form onSubmit={formik.handleSubmit} className="bg-white w-full">
            <label
              className="block text-[#73737D] text-base font-semibold mt-3"
              htmlFor="awardName"
            >
              Award Name <span className="text-red-500 text-sm">*</span>
            </label>
            <p className="text-[#878791] text-xs">
              Character Limit: Max 50 characters
            </p>
            <input
              type="text"
              id="awardName"
              value={formik.values.awardName}
              onChange={(e) =>
                formik.setFieldValue("awardName", e.target.value)
              }
              className="w-full p-2 h-[40px] border border-[#E8E8EC] rounded-md mt-2 focus-visible:outline-none"
            />
            {formik.touched.awardName && formik.errors.awardName && (
              <p className="text-red-500 text-sm">
                {capitalize(formik.errors.awardName.toString())}
              </p>
            )}

            {/* Description */}
            <label
              className="block text-[#73737D] text-base font-semibold mt-3"
              htmlFor="description"
            >
              Description <span className="text-red-500 text-sm">*</span>
            </label>
            <p className="text-[#878791] text-xs">
              Briefly describe the award in 1–2 sentences
            </p>
            <textarea
              id="description"
              value={formik.values.description}
              onChange={(e) =>
                formik.setFieldValue("description", e.target.value)
              }
              className="w-full h-20 p-1 border border-[#E8E8EC] rounded-md mt-2 focus-visible:outline-none"
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-sm">
                {capitalize(formik.errors.description.toString())}
              </p>
            )}

            {/* Criteria */}
            <div className="mb-2">
              <label
                className="block text-[#73737D] text-base font-semibold mt-3"
                htmlFor="criteria"
              >
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
                  {capitalize(formik.errors.criteria.toString())}
                </p>
              )}
            </div>

            <label className="block text-[#73737D] text-base font-semibold mt-2">
              Upload Award Image <span className="text-red-500 text-sm">*</span>
            </label>
            <p className="text-[#878791] text-xs">
              The image should clearly convey the purpose of this award
            </p>

            {previewImage ? (
              <>
                <img
                  src={previewImage}
                  alt="Award Preview"
                  className="mt-2 w-[50%] h-auto object-cover"
                />
                <button
                  type="button"
                  onClick={() => setOpenCropper(true)}
                  className="mt-2 border border-[#585DF9] text-[#585DF9] px-3 py-2 rounded text-sm"
                >
                  Change Award Image
                </button>
              </>
            ) : (
              <label
                onClick={() => setOpenCropper(true)}
                className="w-full py-[50px] mt-2 flex flex-col items-center justify-center border-2 border-dashed border-[#587BAE] rounded-md text-center cursor-pointer"
              >
                <p className="text-[#73737D]">Click to select a file</p>
                <p className="text-sm text-[#73737D]">Only JPG & PNG allowed</p>
              </label>
            )}

            {formik.touched.awardImageContent &&
              formik.errors.awardImageContent && (
                <p className="text-red-500 text-sm">
                  {capitalize(formik.errors.awardImageContent.toString())}
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
                setCroppedImage={(base64: string) => {
                  setCroppedImageBase64(base64);
                  formik.setFieldValue("awardImageContent", base64);
                  formik.setFieldValue("awardPhoto", "");
                }}
              />
            </Modal>
            <div className="flex justify-between gap-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="text-[#E33535] py-2 px-4 border border-[#E33535] !rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-b from-[#7E92F8] to-[#6972F0] py-2 px-4 text-white !rounded-md min-w-[130px] flex justify-center"
              >
                {loading ? "Publishing..." : "Add to Your ORG"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddToOrgModal;
