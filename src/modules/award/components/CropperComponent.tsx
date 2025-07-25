import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Slider,
  CircularProgress,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Cropper, { Area } from "react-easy-crop";
import getCroppedImg from "../../../utilities/CropImage";
import { showToast } from "../../../utilities/toast";

interface CropperComponentProps {
  openModal: boolean;
  handleClose: () => void;
  setCroppedImage: (image: string) => void;
  setPreview: (image: string) => void;
  previewImage?: string;
  onUpload?: () => void;
}

const CropperComponent: React.FC<CropperComponentProps> = ({
  openModal,
  handleClose,
  setCroppedImage,
  setPreview,
  onUpload,
}) => {
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setLoading(true);
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setPreview(croppedImage);
      const base64String = croppedImage.replace(
        /^data:image\/[a-zA-Z]+;base64,/,
        ""
      );
      setCroppedImage(base64String);
      if (onUpload) onUpload();
      handleDialogClose(); // ✅ Close modal after cropping
    } catch (e) {
      showToast("Error cropping image:", "error");
    } finally {
      setLoading(false);
    }
  }, [imageSrc, croppedAreaPixels, setCroppedImage, setPreview, onUpload]);

  const resetState = () => {
    setImageSrc(null);
    setCroppedAreaPixels(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleDialogClose = () => {
    resetState();
    handleClose();
  };

  return (
    <Dialog
      open={openModal}
      onClose={handleDialogClose}
      sx={{ "& .MuiPaper-root": { width: 500, maxWidth: "90%" } }}
    >
      <Box className="p-3">
        <DialogTitle variant="h4" textAlign="center" color="#3F4354">
          Upload Award Image
        </DialogTitle>

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
                <button
                  className="bg-gradient-to-b from-[#7E92F8] py-2 px-4 to-[#6972F0] text-white !rounded-md min-w-[130px] flex justify-center"
                  onClick={showCroppedImage}
                  disabled={loading}
                  aria-label="Crop and save image"
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Crop and Save"
                  )}
                </button>
              </>
            ) : (
              <Button
                className="bg-gradient-to-b from-[#7E92F8] py-2 px-4 to-[#6972F0] text-white !rounded-md min-w-[130px] flex justify-center"
                component="label"
                startIcon={<PhotoCamera />}
                aria-label="Upload photo"
                id="choose_file"
              >
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
            )}
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default CropperComponent;
