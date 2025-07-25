import { useState } from "react";
import * as Yup from "yup";
import {
  useGetProfileDetailsQuery,
  useUpdateEmployeeDetailsMutation,
} from "../../../../profile/queries/profileQuery";
import { useSelector } from "react-redux";
import EmployeeProfilePhotoUpload from "../../EmployeeProfilePhotoUpload";
import { CameraIcon } from "lucide-react";
import Avatar from "../../../../../common/Avatar";
import { showToast } from "../../../../../utilities/toast";
import { useFormik } from "formik";
import ThreeDotsLoading from "../../../../../utilities/ThreeDotsLoading";
import Loading from "../../../../../utilities/Loading";
import Error from "../../../../../utilities/Error";
import { useGetDesignationListQuery } from "../../../queries/globalQuery";

const validationSchema = Yup.object().shape({
  primaryPhone: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  joiningDate: Yup.date().required("Joining Date is required"),
  designation: Yup.string()
    .trim("Designation cannot include leading or trailing spaces")
    .strict(true)
    .required("Designation To is required"),
  shortDescription: Yup.string()
    .required("Short description is required")
    .max(200, "Short description must be at most 200 characters"),
});

const AddProfileDetails = ({
  nextStep,
  prevStep,
  profile,
  profileIsLoading,
  profileIsError,
  profileRefetch,
}: any) => {
  const ORG_ID = useSelector(
    (state: any) => state.auth.userData["custom:orgId"]
  );
  const EMP_ID = useSelector(
    (state: any) => state.auth.userData["custom:empId"]
  );
  const [openModal, setOpenModal] = useState(false);
  const reportsTo = useSelector((state: any) => state.feedProfile.reportsTo);
  const shouldFetchProfileDetails = reportsTo.length > 4;
  const { data: profileDetails } = useGetProfileDetailsQuery(
    { ORG_ID, reportsTo },
    {
      skip: !shouldFetchProfileDetails
    }
  );

  const { data: designationList, isLoading: designationListIsLoading } =
    useGetDesignationListQuery(ORG_ID);

  const [updateEmployeeDetails, { isLoading: updateEmployeeDetailsIsLoading }] =
    useUpdateEmployeeDetailsMutation();
  const imageUrl = profile?.data?.photo || "";
  const imageWithTimestamp = imageUrl
    ? `${imageUrl}?t=${new Date().getTime()}`
    : "";

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: profile?.data?.firstName || "",
      lastName: profile?.data?.lastName || "",
      middleName: profile?.data?.middleName || "",
      gender: profile?.data?.gender || "",
      primaryEmail: profile?.data?.primaryEmail || "",
      primaryPhone: profile?.data?.primaryPhone || "",
      reportsTo: profile?.data?.reportsTo || "",
      dateOfBirth: profile?.data?.dateOfBirth || "",
      nationality: profile?.data?.nationality || "",
      joiningDate: profile?.data?.joiningDate || "",
      grade: profile?.data?.grade?.entityId || "",
      costCenter: profile?.data?.costCenter?.entityId || "",
      department: profile?.data?.department?.entityId || "",
      designation: profile?.data?.designation?.entityId || "",
      location: profile?.data?.location || "",
      shortDescription: profile?.data?.shortDescription || "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const updatedEmployee = {
          ...values,
        };

        const { message } = await updateEmployeeDetails({
          EMP_ID,
          ORG_ID,
          updatedEmployee,
        }).unwrap();
        resetForm();
        showToast(message, "success");
      } catch (error: any) {
        showToast(error?.data?.message || "Something went wrong", "error");
      }
    },
  });

  const handleNextClick = async () => {
    const isValid = await formik.validateForm();
    formik.setTouched({
      primaryPhone: true,
      shortDescription: true,
    });

    if (Object.keys(isValid).length === 0) {
      await formik.submitForm();
      nextStep();
    }
  };

  const handleBackClick = () => {
    prevStep();
  };

  if (profileIsLoading) {
    return (
      <div className="flex justify-center items-center mt-2 min-h-[70vh] p-3 bg-white rounded-md">
        <Loading />
      </div>
    );
  }

  if (profileIsError) {
    return (
      <div className="flex justify-center items-center mt-2 min-h-[70vh] p-3 bg-white rounded-md">
        <Error />
      </div>
    );
  }

  return (
    <div className="w-full">
      <p className="mb-3 font-semibold text-xl text-[#585DF9]">
        Fill your details
      </p>
      <div className="w-full">
        <div className="w-full gap-3 flex justify-content">
          <div className="w-[25%] flex flex-col items-center">
            <div className="flex flex-col items-center mb-3">
              <Avatar
                image={imageWithTimestamp}
                name={profile?.data?.firstName || ""}
                size={100}
              />
              <button
                onClick={() => setOpenModal(true)}
                className="flex gap-2 bg-gradient-to-b from-[#7E92F8] py-2 px-4 to-[#6972F0] text-white !rounded-md mt-3"
              >
                <CameraIcon className="w-5 h-5 text-white" />
                <p>Upload</p>
              </button>
            </div>

            <EmployeeProfilePhotoUpload
              openModal={openModal}
              handleClose={() => setOpenModal(false)}
              refetch={profileRefetch}
              profileDetails={profileDetails}
              profile={profile}
            />
          </div>
          <div className="w-[75%]">
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[#73737D] text-base font-semibold">
                  Primary Phone
                </label>
                <p className="text-[#878791] text-xs">
                  Character Limit: Max 10 characters
                </p>
                <input
                  type="text"
                  name="primaryPhone"
                  value={formik.values.primaryPhone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-2 h-[40px] border-1 border-[#E8E8EC] rounded-md mt-2 focus-visible:outline-none"
                />
                {formik.touched.primaryPhone &&
                  typeof formik.errors.primaryPhone === "string" && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.primaryPhone}
                    </p>
                  )}
              </div>

              {!profile?.data?.joiningDate && !profile?.data?.designation && (
                <div className="flex gap-3">
                  {!profile?.data?.joiningDate && (
                    <div className="w-full">
                      <label className="block text-[#73737D] text-base font-semibold">
                        Joining Date
                      </label>
                      <p className="text-[#878791] text-xs">
                        Info: Enter a valid date
                      </p>
                      <input
                        type="date"
                        name="joiningDate"
                        value={
                          formik.values.joiningDate ||
                          profile?.data?.joiningDate ||
                          ""
                        }
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full p-2 h-[40px] border border-[#E8E8EC] rounded-md mt-2 focus-visible:outline-none"
                      />
                      {formik.touched.joiningDate &&
                        typeof formik.errors.joiningDate === "string" && (
                          <p className="text-red-500 text-sm">
                            {formik.errors.joiningDate}
                          </p>
                        )}
                    </div>
                  )}
                  {!profile?.data?.designation && (
                    <div className="w-full mb-2">
                      <label className="block text-[#73737D] text-base font-semibold">
                        Designation
                      </label>
                      <p className="text-[#878791] text-xs">
                        Info: Select Designation
                      </p>
                      <select
                        id="designation"
                        name="designation"
                        value={formik.values.designation}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full p-2 h-[40px] border rounded-md mt-2 focus-visible:outline-none ${
                          formik.touched.designation &&
                          formik.errors.designation
                            ? "border-red-500"
                            : "border-[#E8E8EC]"
                        }`}
                      >
                        {designationListIsLoading ? (
                          <option disabled>Loading...</option>
                        ) : (
                          <>
                            <option value="" disabled>
                              Select Designation
                            </option>
                            {designationList?.data?.map((designation: any) => (
                              <option
                                key={designation.entityId}
                                value={String(designation.entityId)}
                              >
                                {designation.designationName}
                              </option>
                            ))}
                          </>
                        )}
                      </select>

                      {formik.touched.designation &&
                        typeof formik.errors.designation === "string" && (
                          <p className="text-red-500 text-sm">
                            {formik.errors.designation}
                          </p>
                        )}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-[#73737D] text-base font-semibold">
                  About You
                </label>
                <p className="text-[#878791] text-xs">
                  Character Limit: Max 200 characters
                </p>
                <textarea
                  name="shortDescription"
                  rows={4}
                  value={formik.values.shortDescription}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-2 h-[100px] border-1 border-[#E8E8EC] rounded-md mt-2 focus-visible:outline-none resize-y"
                />
                {formik.touched.shortDescription &&
                  typeof formik.errors.shortDescription === "string" && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.shortDescription}
                    </p>
                  )}
              </div>
            </form>
          </div>
        </div>
        <div className="flex justify-between mt-3">
          <button
            type="button"
            onClick={handleBackClick}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Back
          </button>
          <div className="flex gap-3">
            {/* <button
              type="button"
              onClick={handleSkipClick}
              className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
            >
              Next
            </button> */}
            <button
              type="button"
              onClick={handleNextClick}
              className="bg-gradient-to-b from-[#7E92F8] py-2 px-4 to-[#6972F0] text-white !rounded-md min-w-[100px] flex justify-center flex justify-center"
            >
              {updateEmployeeDetailsIsLoading ? (
                <ThreeDotsLoading color="white" />
              ) : (
                "Update"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProfileDetails;
