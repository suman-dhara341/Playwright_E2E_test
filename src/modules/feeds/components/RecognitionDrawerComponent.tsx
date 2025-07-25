import React, { useState } from "react";
import { TextField, Autocomplete, Modal } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormValues } from "../interfaces";
import "react-quill/dist/quill.snow.css";
import { useCreateRecognitionMutation } from "../queries/feedQuery";
import { useGetBadgeByTypeQuery } from "../../badge/queries/badgeQuery";
import { useGetSearchEmployeesQuery } from "../../global/queries/globalQuery";
import { useSelector } from "react-redux";
import debounce from "lodash/debounce";
import { showToast } from "../../../utilities/toast";
import ThreeDotsLoading from "../../../utilities/ThreeDotsLoading";
import { X } from "lucide-react";
import Avatar from "../../../common/Avatar";

const validationSchema = Yup.object().shape({
  recognitionReceivedBy: Yup.string().required(
    "Recognition Received By is required"
  ),
  recognitionContent: Yup.string()
    .trim()
    .required("Recognition Content is required"),
});

const RecognitionDrawerComponent = ({
  handleDrawerClose,
  setConfettiVisible,
}: any) => {
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const badgeType = "Custom";
  const [selectedBadge, setSelectedBadge] = useState<any>("");
  const [createRecognition, { isLoading, isSuccess }] =
    useCreateRecognitionMutation();
  const [nextToken] = useState<string | null>(null);
  const { data: badges, isLoading: badgeDataIsLoading } =
    useGetBadgeByTypeQuery({ badgeType, nextToken });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBadge, setSearchBadge] = useState("");
  const { data: employeesData, isLoading: employeesDataIsLoading } =
    useGetSearchEmployeesQuery(
      { ORG_ID, keyword: searchQuery, category: "employee" },
      { skip: !searchQuery }
    );
  const debouncedSearchChange = debounce((value: string) => {
    setSearchQuery(value);
  }, 300);

  const handleSearchInputChange = (
    _event: React.SyntheticEvent,
    value: string
  ) => {
    debouncedSearchChange(value);
  };

  const handleBadgeSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchBadge(event.target.value);
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      recognitionGivenBy: EMP_ID,
      recognitionReceivedBy: "",
      recognitionContent: "",
      bannerFileContent: "",
      bannerFileName: "",
      badgeId: "",
      taggedEmployees: [],
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await createRecognition({
          ORG_ID,
          newRecognition: values,
        }).unwrap();
        setConfettiVisible(true);
        showToast("Successfully give recognition", "success");
        handleDrawerClose();
        resetForm({
          values: {
            recognitionGivenBy: EMP_ID,
            recognitionReceivedBy: "",
            recognitionContent: "",
            bannerFileContent: "",
            bannerFileName: "",
            badgeId: "",
            taggedEmployees: [],
          },
        });
      } catch (error: any) {
        if (isSuccess) {
          showToast("Successfully gave recognition", "error");
        } else {
          showToast(
            error?.data?.message || "Failed to give recognition",
            "error"
          );
        }
      }
    },
  });

  const handleCardBadgeSelect = (badge: any) => {
    setSelectedBadge(badge);
    formik.setFieldValue(
      "badgeId",
      badge ? `${badge.type}||${badge.category}` : ""
    );
  };

  const filteredBadges = badges?.data?.filter((badge: any) =>
    badge.name.toLowerCase().includes(searchBadge.toLowerCase())
  );

  return (
    <Modal
      open
      onClose={handleDrawerClose}
      aria-labelledby="recognition-modal-title"
      aria-describedby="recognition-modal-description"
      className="flex items-center justify-center border-0"
    >
      <div
        className="bg-white rounded-md shadow-lg w-[40%] overflow-hidden outline-0"
        onClick={(event: React.MouseEvent) => event.stopPropagation()}
      >
        <div className="flex justify-between p-3">
          <p className="font-semibold text-lg text-[#585DF9]">
            Give Recognition
          </p>
          <div onClick={handleDrawerClose} className="cursor-pointer">
            <X className="w-5 h-5" />
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="px-3 pb-3 space-y-2">
          <div>
            <p className="text-[#73737D] font-semibold text-base">
              Select badge
            </p>
            <p className="text-[#878791] text-xs">please select one badge</p>

            {selectedBadge ? (
              <div className="flex items-center gap-4 my-3">
                <div className="flex-shrink-0">
                  <img
                    src={selectedBadge.badgePhoto}
                    alt={selectedBadge.name}
                    className="w-16 h-16 rounded-full object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#73737D]">
                    {selectedBadge.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBadge(null);
                      formik.setFieldValue("badgeId", "");
                    }}
                    className="text-xs text-red-500 underline mt-1"
                  >
                    Change badge
                  </button>
                </div>
              </div>
            ) : (
              <>
                <input
                  value={searchBadge}
                  onChange={handleBadgeSearchChange}
                  className="w-full p-2 h-[40px] border-1 border-[#E8E8EC] rounded-md mt-2 focus-visible:outline-none"
                  placeholder="Search Custom Badge..."
                />
                <div className="overflow-x-auto gap-4 flex my-3">
                  {badgeDataIsLoading ? (
                    <div className="text-sm text-[#73737D] min-h-[115px]">
                      Loading badges...
                    </div>
                  ) : filteredBadges?.length ? (
                    filteredBadges?.map((badge: any) => (
                      <div
                        key={`${badge.name}_${badge.awardedAt}_${badge.category}`}
                        className="cursor-pointer flex-shrink-0 w-17"
                        onClick={() => handleCardBadgeSelect(badge)}
                        id="badge_select"
                      >
                        <img
                          src={badge?.badgePhoto}
                          alt={badge.name}
                          className="w-16 h-16 rounded-full object-contain"
                        />
                        <p className="text-xs text-center mt-1">{badge.name}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-[#73737D]">
                      No badges found.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="flex gap-3 w-full">
            <div className="w-full">
              <p className="text-[#73737D] font-semibold text-base">To</p>
              <p className="text-[#878791] text-xs">
                Whom do you want to recognize today
              </p>
              <Autocomplete
                options={
                  employeesData?.data?.filter(
                    (emp) =>
                      emp.employeeId !== EMP_ID &&
                      emp.employeeId !== formik.values.recognitionReceivedBy
                  ) || []
                }
                loading={employeesDataIsLoading}
                getOptionLabel={(option) => option.employeeName}
                onInputChange={handleSearchInputChange}
                onChange={(_event, value) => {
                  formik.setFieldValue(
                    "recognitionReceivedBy",
                    value ? value.employeeId : ""
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    placeholder="Search an employee"
                    name="recognitionReceivedBy"
                    error={
                      formik.touched.recognitionReceivedBy &&
                      Boolean(formik.errors.recognitionReceivedBy)
                    }
                    helperText={
                      formik.touched.recognitionReceivedBy &&
                      formik.errors.recognitionReceivedBy
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#E8E8EC",
                          borderWidth: "1px",
                        },
                        "&:hover fieldset": {
                          borderColor: "#E8E8EC",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#E8E8EC",
                        },
                        paddingY: "2px",
                        paddingX: "8px",
                      },
                      "& .MuiInputBase-input": {
                        padding: "8px 10px",
                      },
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li
                    id="employee_select"
                    {...props}
                    className="flex items-center gap-2 p-2"
                  >
                    <Avatar
                      image={option.employeeAvatar}
                      name={option.employeeName}
                      size={30}
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {option.employeeName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {option.employeeEmail}
                      </p>
                    </div>
                  </li>
                )}
              />
            </div>
            <div className="w-full">
              <p className="text-[#73737D] font-semibold text-base">
                Tag Employees
              </p>
              <p className="text-[#878791] text-xs">
                Do you want to notify anyone else?
              </p>
              <Autocomplete
                multiple
                options={
                  employeesData?.data?.filter(
                    (emp) =>
                      emp.employeeId !== EMP_ID &&
                      emp.employeeId !== formik.values.recognitionReceivedBy
                  ) || []
                }
                loading={employeesDataIsLoading}
                getOptionLabel={(option) =>
                  [option.employeeName].filter(Boolean).join(" ")
                }
                onInputChange={handleSearchInputChange}
                onChange={(_event, value) =>
                  formik.setFieldValue(
                    "taggedEmployees",
                    value.map((v) => v.employeeId)
                  )
                }
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
                        "&:hover fieldset": {
                          borderColor: "#E8E8EC",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#E8E8EC",
                        },
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
                  <li
                    id="tag_Employee"
                    {...props}
                    className="flex items-center gap-2 p-2"
                  >
                    <Avatar
                      image={option.employeeAvatar}
                      name={option.employeeName}
                      size={30}
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {option.employeeName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {option.employeeEmail}
                      </p>
                    </div>
                  </li>
                )}
                loadingText="Loading employees..."
              />
            </div>
          </div>

          <div>
            <p className="text-[#73737D] font-semibold text-base">Content</p>
            <p className="text-[#878791] text-xs">
              What do you want to recognize them for?
            </p>
            <TextField
              id="recognition_details_content"
              variant="outlined"
              fullWidth
              margin="dense"
              placeholder="Thank you for helping me"
              name="recognitionContent"
              multiline
              rows={3}
              value={formik.values.recognitionContent}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.recognitionContent &&
                Boolean(formik.errors.recognitionContent)
              }
              helperText={
                formik.touched.recognitionContent &&
                formik.errors.recognitionContent
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#E8E8EC",
                    borderWidth: "1px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#E8E8EC",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#E8E8EC",
                  },
                  paddingY: "2px",
                  paddingX: "8px",
                },
                "& .MuiInputBase-input": {
                  padding: "8px 10px",
                },
              }}
            />
          </div>

          <div className="flex justify-end">
            <button
              id="giveRecognition_submit"
              type="submit"
              className="flex justify-center text-sm text-white bg-gradient-to-b from-[#7E92F8] to-[#6972F0] px-4 py-2 !rounded-md min-w-[140px]"
              disabled={isLoading}
            >
              {isLoading ? (
                <ThreeDotsLoading color="white" />
              ) : (
                "Give Recognition"
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default RecognitionDrawerComponent;
