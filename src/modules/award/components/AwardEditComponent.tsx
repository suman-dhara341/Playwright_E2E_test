import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { DrawerProps, FormValues } from "../interfaces/index";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  useGetAwardByIdQuery,
  useLazyGetEmployeeBulkListQuery,
  useUpdateAwardMutation,
} from "../queries/awardQuery";
import { useSelector } from "react-redux";
import ThreeDotsLoading from "../../../utilities/ThreeDotsLoading";
import Drawer from "../../../common/Drawer";
import { Autocomplete, TextField } from "@mui/material";
import debounce from "lodash/debounce";
import { useGetSearchEmployeesQuery } from "../../global/queries/globalQuery";
import Avatar from "../../../common/Avatar";
import { showToast } from "../../../utilities/toast";

const validationSchema = Yup.object().shape({
  awardName: Yup.string().required("Award Name is required"),
  description: Yup.string().required("Description is required"),
  criteria: Yup.string().required("Criteria is required"),
  moderators: Yup.array()
    .of(Yup.string())
    .min(1, "At least one moderator is required")
    .required("At least one moderator is required"),
});

const AwardEditComponent: React.FC<DrawerProps> = ({
  handleDrawerClose,
  drawerOpen,
  award,
}) => {
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const quillRef = useRef(null);
  const awardId = award?.awardId;

  const [updateAward] = useUpdateAwardMutation();
  const { refetch } = useGetAwardByIdQuery({ ORG_ID, EMP_ID, awardId });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedModerators, setSelectedModerators] = useState<any[]>([]);

  const { data: employeesData, isLoading: employeesDataIsLoading } =
    useGetSearchEmployeesQuery(
      { ORG_ID, keyword: searchQuery, category: "employee" },
      { skip: !searchQuery }
    );

  const [
    triggerGetEmployeeBulkList,
    {
      data: awardModeratorList,
      isLoading: awardModeratorListIsLoading,
      isError: awardModeratorListIsError,
    },
  ] = useLazyGetEmployeeBulkListQuery();

  const debouncedSearchChange = debounce((value: string) => {
    setSearchQuery(value);
  }, 300);

  useEffect(() => {
    return () => {
      debouncedSearchChange.cancel();
    };
  }, []);

  const handleSearchInputChange = (
    _event: React.SyntheticEvent,
    value: string
  ) => {
    debouncedSearchChange(value);
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      awardName: "",
      description: "",
      criteria: "",
      moderators: [],
      awardImageContent: "",
      awardPhoto: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setIsLoading(true);
        await updateAward({
          ORG_ID,
          awardId,
          updatedAward: {
            awardName: values.awardName,
            description: values.description,
            criteria: values.criteria,
            awardImageContent: values.awardImageContent,
            awardPhoto: values.awardPhoto,
            moderators: values.moderators,
          },
        }).unwrap();
        await refetch();
        triggerGetEmployeeBulkList({ ORG_ID, EMPLOYEE_IDS: values.moderators });
        handleDrawerClose();
        showToast("Updated successfully", "success");
        resetForm();
        setImagePreview(null);
      } catch (error: any) {
        showToast(error?.data?.message || "Update failed: ", "error");
      }
      setIsLoading(false);
    },
  });

  useEffect(() => {
    if (drawerOpen && award) {
      formik.setValues({
        awardName: award.awardName || "",
        description: award.description || "",
        criteria: award.criteria || "",
        moderators: award.moderators?.map((mod: any) => mod.employeeId) || [],
        awardImageContent: award.awardImageContent || "",
        awardPhoto: award.awardPhoto || "",
      });
      setImagePreview(award.awardPhoto || null);
      triggerGetEmployeeBulkList({
        ORG_ID,
        EMPLOYEE_IDS: award.moderatorId || [],
      });
    }
  }, [drawerOpen, award]);

  useEffect(() => {
    if (awardModeratorList?.data) {
      const mappedModerators = awardModeratorList.data.map((mod: any) => ({
        employeeId: mod.employeeId,
        employeeName: `${mod.firstName} ${mod.lastName}`.trim(),
        employeeEmail: mod.primaryEmail,
        employeeAvatar: mod.photo,
      }));
      setSelectedModerators(mappedModerators);
    }
  }, [awardModeratorList]);

  const handleQuillChange = (content: string) => {
    formik.setFieldValue("criteria", content);
  };

  if (!award) return null;

  return (
    <Drawer
      isOpen={drawerOpen}
      onClose={handleDrawerClose}
      heading="Update Award details"
    >
      <form
        onSubmit={formik.handleSubmit}
        className="overflow-y-auto max-h-[calc(100vh-90px)]"
      >
        {imagePreview && (
          <div>
            <p className="block text-[#3F4354] text-base font-semibold mb-3">
              Award Name - {award.awardName}
            </p>
            <img
              src={imagePreview}
              alt="Award Preview"
              className="rounded w-1/4 max-w-md"
            />
          </div>
        )}

        <div className="mt-3">
          <label className="block text-[#73737D] text-base font-semibold">
            Moderators <span className="text-red-500 text-sm">*</span>
          </label>
          <p className="text-[#878791] text-xs mb-1">
            Who will moderate this award?
          </p>

          {awardModeratorListIsLoading ? (
            <p className="text-sm text-gray-500 mt-2">Loading moderators...</p>
          ) : awardModeratorListIsError ? (
            <p className="text-sm text-red-500 mt-2">
              Failed to load moderators. Please try again.
            </p>
          ) : (
            <Autocomplete
              multiple
              options={
                employeesData?.data?.filter(
                  (emp: any) =>
                    emp?.employeeId !== EMP_ID &&
                    !formik.values.moderators.includes(emp?.employeeId)
                ) || []
              }
              value={selectedModerators}
              loading={employeesDataIsLoading}
              isOptionEqualToValue={(option, value) =>
                option.employeeId === value.employeeId
              }
              getOptionLabel={(option) => option?.employeeName || ""}
              onInputChange={handleSearchInputChange}
              onChange={(_event, value) => {
                formik.setFieldValue(
                  "moderators",
                  value.map((v) => v.employeeId)
                );
                setSelectedModerators(value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  placeholder="Search and tag employees"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#E8E8EC",
                        borderWidth: "1px",
                      },
                      "&:hover fieldset": { borderColor: "#E8E8EC" },
                      "&.Mui-focused fieldset": { borderColor: "#E8E8EC" },
                      paddingY: "2px",
                      paddingX: "8px",
                    },
                    "& .MuiInputBase-input": {
                      padding: "2px 10px",
                    },
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props} className="flex items-center gap-2 p-2">
                  <Avatar
                    image={option.employeeAvatar}
                    name={option.employeeName}
                    size={30}
                  />
                  <div>
                    <p className="text-sm font-medium">{option.employeeName}</p>
                    <p className="text-xs text-gray-500">
                      {option.employeeEmail}
                    </p>
                  </div>
                </li>
              )}
              loadingText="Loading employees..."
            />
          )}

          {formik.touched.moderators && formik.errors.moderators && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.moderators as string}
            </p>
          )}
        </div>

        <div className="mt-3">
          <label className="block text-[#73737D] text-base font-semibold">
            Description
          </label>
          <p className="text-[#878791] text-xs">
            Briefly describe the award in 1-2 sentences
          </p>
          <textarea
            rows={3}
            {...formik.getFieldProps("description")}
            className="w-full h-20 p-1 border border-[#E8E8EC] rounded-md mt-2 focus-visible:outline-none"
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.description}
            </p>
          )}
        </div>

        <div className="mt-3">
          <label className="block text-[#73737D] text-base font-semibold">
            Criteria <span className="text-red-500 text-sm">*</span>
          </label>
          <p className="text-[#878791] text-xs">
            Enter detailed criteria for earning this award.
          </p>
          <ReactQuill
            theme="snow"
            value={formik.values.criteria}
            onChange={handleQuillChange}
            ref={quillRef}
            className="mt-2"
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
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.criteria}
            </p>
          )}
        </div>

        <div className="flex justify-between gap-2 mt-6">
          <button
            type="button"
            onClick={handleDrawerClose}
            className="text-[#E33535] py-2 px-4 border-[#E33535] border-[1px] !rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-b from-[#7E92F8] py-2 px-4 to-[#6972F0] text-white !rounded-md min-w-[100px] flex justify-center"
          >
            {isLoading ? <ThreeDotsLoading color="white" /> : "Update"}
          </button>
        </div>
      </form>
    </Drawer>
  );
};

export default AwardEditComponent;
