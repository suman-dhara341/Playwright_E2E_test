import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import ThreeDotsLoading from "../../../../../utilities/ThreeDotsLoading";
import { useDispatch, useSelector } from "react-redux";
import { useCreateRecognitionMutation } from "../../../../feeds/queries/feedQuery";
import { useGetBadgeByTypeQuery } from "../../../../badge/queries/badgeQuery";
import { useGetSearchEmployeesQuery } from "../../../queries/globalQuery";
import { debounce } from "lodash";
import { showToast } from "../../../../../utilities/toast";
import { Autocomplete, TextField } from "@mui/material";
import { FormValues } from "../../../../feeds/interfaces";
import { useGetProfileQuery } from "../../../../profile/queries/profileQuery";
import { setOnboardingStatus } from "../../../slice/onboardingSlice";
import Avatar from "../../../../../common/Avatar";

const validationSchema = Yup.object().shape({
  recognitionReceivedBy: Yup.string().required(
    "Recognition Received By is required"
  ),
  recognitionContent: Yup.string()
    .trim()
    .required("Recognition Content is required"),
});

const AddRecognition = ({ nextStep, prevStep }: any) => {
  const dispatch = useDispatch();
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const badgeType = "Custom";
  const [selectedBadge, setSelectedBadge] = useState<any>("");
  const [nextToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBadge] = useState("");
  const [confettiVisible, setConfettiVisible] = useState(false);
  const [createRecognition, { isLoading, isSuccess }] =
    useCreateRecognitionMutation();

  const { data: badges, isLoading: badgeDataIsLoading } =
    useGetBadgeByTypeQuery({ badgeType, nextToken });

  const { refetch: profileRefetch } = useGetProfileQuery(
    { ORG_ID, EMP_ID }
  );
  const { data: employeesData, isLoading: employeesDataIsLoading } =
    useGetSearchEmployeesQuery(
      { ORG_ID, keyword: searchQuery, category: "employee" },
      { skip: !searchQuery}
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

  useEffect(() => {
    if (confettiVisible) {
      const timer = setTimeout(() => {
        setConfettiVisible(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [confettiVisible]);

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
        await profileRefetch();
        showToast("Successfully give recognition", "success");
        nextStep();
        dispatch(setOnboardingStatus(true));
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
          showToast("Successfully give recognition", "success");
        } else {
          showToast("Failed to give recognition", "error");
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

  const handleNextClick = async () => {
    await formik.submitForm();
    nextStep();
  };

  const handleBackClick = () => {
    prevStep();
  };

  const handleComplete = async () => {
    await profileRefetch();
    dispatch(setOnboardingStatus(true));
  };

  const filteredBadges = badges?.data?.filter((badge: any) =>
    badge.name.toLowerCase().includes(searchBadge.toLowerCase())
  );

  return (
    <div>
      <p className="font-semibold text-xl text-[#585DF9] mb-2">
        Recognize your Peer or Senior or Manager for their hard work
      </p>
      <form onSubmit={formik.handleSubmit} className="pb-3 space-y-2">
        <div>
          <p className="text-[#73737D] font-semibold text-base">Select badge</p>
          <p className="text-[#878791] text-xs">please select one badge</p>

          {selectedBadge ? (
            <div className="flex items-center gap-3 my-2">
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
            <div className="overflow-x-auto gap-3 flex my-3">
              {badgeDataIsLoading ? (
                <div className="text-sm text-[#73737D] min-h-[75px]">
                  Loading badges...
                </div>
              ) : filteredBadges?.length ? (
                filteredBadges?.map((badge: any) => (
                  <div
                    key={`${badge.name}_${badge.awardedAt}_${badge.category}`}
                    className="cursor-pointer flex-shrink-0 w-17"
                    onClick={() => handleCardBadgeSelect(badge)}
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
                <div className="text-sm text-[#73737D]">No badges found.</div>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-3 w-full">
          <div className="w-full">
            <p className="text-[#73737D] font-semibold text-base">To</p>
            <p className="text-[#878791] text-xs">
              Whom do you want to recognize today?
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
              getOptionLabel={(option) =>
                [option.employeeName].filter(Boolean).join(" ")
              }
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
          </div>
        </div>

        <div>
          <p className="text-[#73737D] font-semibold text-base">Content</p>
          <p className="text-[#878791] text-xs">
            What do you want to recognize them for?
          </p>
          <TextField
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
      </form>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleBackClick}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Back
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleComplete}
            className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
          >
            Finish
          </button>

          <button
            type="button"
            onClick={handleNextClick}
            className="flex justify-center bg-green-500 py-2 px-4 text-white !rounded-md min-w-[100px]"
          >
            {isLoading ? (
              <ThreeDotsLoading color="white" />
            ) : (
              "Give Recognition"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRecognition;
