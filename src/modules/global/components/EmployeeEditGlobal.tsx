import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUpdateEmployeeDetailsMutation } from "../../profile/queries/profileQuery";
import { showToast } from "../../../utilities/toast";
import EmployeeProfilePhotoUpload from "./EmployeeProfilePhotoUpload";
import EmployeePasswordChange from "./EmployeePasswordChange";
import ThreeDotsLoading from "../../../utilities/ThreeDotsLoading";
import Avatar from "../../../common/Avatar";
import { CameraIcon } from "lucide-react";

const validationSchema = Yup.object().shape({
  primaryPhone: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  shortDescription: Yup.string()
    .required("Short description is required")
    .max(200, "Short description must be at most 200 characters"),
});

const EmployeeEditGlobal = ({
  EMP_ID,
  ORG_ID,
  profileDetails,
  profile,
  profileRefetch,
}: any) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const imageUrl = profile?.data?.photo || "";
  const imageWithTimestamp = imageUrl
    ? `${imageUrl}?t=${new Date().getTime()}`
    : "";

  const [updateEmployeeDetails, { isLoading: updateEmployeeDetailsIsLoading }] =
    useUpdateEmployeeDetailsMutation();

  const formik = useFormik({
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
        profileRefetch();
        showToast(message, "success");
      } catch (error: any) {
        showToast(error?.data?.message || "Something went wrong", "error");
      }
    },
  });

  return (
    <div className="">
      {/* Profile Avatar */}
      <div className="flex flex-col items-center">
        <div className="relative mb-3">
          <Avatar image={imageWithTimestamp} name={profile?.data?.firstName || ''} size={100} />
          <button
            onClick={() => setOpenModal(true)}
            className="absolute top-[50px] left-[35px] text-white rounded-full p-2 mt-2"
          >
            <CameraIcon className="w-5 h-5" />
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

      {/* Tab Header */}
      <div
        className="bg-white rounded-md mb-3 overflow-hidden"
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 4px" }}
      >
        <div className="flex text-[#3F4354] bg-white rounded-md p-0">
          {["Basic Details", "Security"].map((label, index) => (
            <button
              key={index}
              onClick={() => setTabIndex(index)}
              className={`h-[40px] flex items-center gap-2 px-3 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                tabIndex === index
                  ? "bg-[#585DF9] text-white border-b-2 !border-b-[#585DF9] border-r-none"
                  : "border-b-2 border-white text-[#73737D]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-3">
        {tabIndex === 0 && (
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
                className="w-full p-2 h-[100px] border-1 border-[#E8E8EC] rounded-md mt-2 focus-visible:outline-none"
              />
              {formik.touched.shortDescription &&
                typeof formik.errors.shortDescription === "string" && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.shortDescription}
                  </p>
                )}
            </div>

            <div className="text-right">
              <button
                type="submit"
                className="bg-gradient-to-b from-[#7E92F8] py-2 px-4 to-[#6972F0] text-white !rounded-md min-w-[100px] flex justify-center"
              >
                {updateEmployeeDetailsIsLoading ? (
                  <ThreeDotsLoading color="white" />
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </form>
        )}

        {/* {tabIndex === 1 && (
          <div>
            <EmployeeAddress EMP_ID={EMP_ID} ORG_ID={ORG_ID} />
          </div>
        )} */}

        {tabIndex === 1 && (
          <div>
            <EmployeePasswordChange />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeEditGlobal;
