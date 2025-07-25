import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Avatar,
  Slider,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { employeeImageUploadData } from "../../profile/interfaces/index";
import { useUploadEmployeeProfileImageMutation } from "../../profile/queries/profileQuery";
import { useSelector } from "react-redux";
import Cropper, { Area } from "react-easy-crop";
import getCroppedImg from "../../../utilities/CropImage";
import { showToast } from "../../../utilities/toast";
import ThreeDotsLoading from "../../../utilities/ThreeDotsLoading";

interface EmployeeProfilePhotoUploadProps {
  openModal: boolean;
  handleClose: () => void;
  refetch: any;
  profileDetails: any;
  profile: any;
}

const validationSchema = Yup.object({
  avatarFileBase64: Yup.string().required("Image is required"),
});

const EmployeeProfilePhotoUpload: React.FC<EmployeeProfilePhotoUploadProps> = ({
  openModal,
  handleClose,
  refetch,
  profile,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [imageEdit, setImageEdit] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const [employeeImageUpload, { isLoading }] =
    useUploadEmployeeProfileImageMutation();

  const formik = useFormik<employeeImageUploadData>({
    initialValues: {
      avatarFileName: "",
      avatarFileType: "",
      avatarFileBase64: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await employeeImageUpload({
          ORG_ID,
          EMP_ID,
          profileImage: values,
        })
          .unwrap()
          .then(() => {
            refetch();
            resetForm();
            handleClose();
            setImageEdit(false);
            showToast("Profile image uploaded successfully", "success");
          })
          .catch(() => {
            showToast("Failed to upload profile image", "error");
          });
      } catch (err: any) {
        showToast(
          err?.data?.message || "Failed to upload profile image",
          "error"
        );
      }
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = useCallback(async () => {
    try {
      if (imageSrc && croppedAreaPixels) {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        setPreview(croppedImage);
        const base64String = croppedImage.replace(
          /^data:image\/[a-zA-Z]+;base64,/,
          ""
        );
        formik.setFieldValue("avatarFileName", "cropped-image.jpg");
        formik.setFieldValue("avatarFileType", "image/jpeg");
        formik.setFieldValue("avatarFileBase64", base64String);
        setImageSrc(null);
        setCroppedAreaPixels(null);
        setImageEdit(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels, formik]);

  const imageUrl = profile?.data?.photo || "";
  const imageWithTimestamp = imageUrl
    ? `${imageUrl}?t=${new Date().getTime()}`
    : "";

  return (
    <Dialog
      open={openModal}
      onClose={handleClose}
      PaperProps={{ style: { width: "500px", maxWidth: "90%" } }}
    >
      <Box className="p-3">
        <DialogTitle variant="h4" textAlign="center" color={"#3F4354"}>
          Upload Profile Photo
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent className="p-2">
            <Box className="flex items-center flex-column gap-2">
              {imageSrc ? (
                <>
                  <Box position="relative" width="100%" height="300px">
                    <Cropper
                      image={imageSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </Box>
                  <Slider
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    sx={{
                      backgroundColor: "#ccc !important",
                      color: "#585DF9",
                      padding: "2px",
                      height: "1px",
                    }}
                    onChange={(_e, newValue) => setZoom(newValue as number)}
                    aria-labelledby="Zoom"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={showCroppedImage}
                  >
                    Crop and Save
                  </Button>
                </>
              ) : (
                <>
                  <Avatar
                    src={preview || imageWithTimestamp}
                    alt="Profile Preview"
                    sx={{ width: 100, height: 100 }}
                  />
                  <Button
                    className="!text-[#585DF9]"
                    component="label"
                    startIcon={<PhotoCamera />}
                  >
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleFileChange}
                    />
                  </Button>
                  {formik.errors.avatarFileBase64 &&
                    formik.touched.avatarFileBase64 && (
                      <Box color="red">{formik.errors.avatarFileBase64}</Box>
                    )}
                </>
              )}
            </Box>
          </DialogContent>
          {imageEdit && (
            <DialogActions>
              <Box className="flex justify-center items-center w-100 gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                  onClick={handleClose}
                >
                  Close
                </button>
                <button
                  className="bg-gradient-to-b from-[#7E92F8] py-2 px-4 to-[#6972F0] text-white !rounded-md min-w-[100px] flex justify-center flex justify-center"
                  type="submit"
                  disabled={isLoading || !preview}
                >
                  {isLoading ? <ThreeDotsLoading color="white" /> : "Upload"}
                </button>
              </Box>
            </DialogActions>
          )}
        </form>
      </Box>
    </Dialog>
  );
};

export default EmployeeProfilePhotoUpload;
