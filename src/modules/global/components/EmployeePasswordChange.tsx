import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { showToast } from "../../../utilities/toast";
import EmployeePassWord from "./EmployeePassWord";
import { ChangePasswordFormValues } from "../../authentication/interfaces/index";
import { Eye, EyeOff, Info } from "lucide-react";
import { useChangePasswordMutation } from "../queries/globalQuery";

const validationSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .trim()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])(?=\S.*\S).{8,}$/,
      "Password does not meet the criteria"
    )
    .required("Old password is required"),
  newPassword: Yup.string()
    .trim()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])(?=\S.*\S).{8,}$/,
      "Password does not meet the criteria"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref("newPassword")],
      "Confirm password must match the new password."
    )
    .required("Confirm Password is required"),
});

const EmployeePasswordChange = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [changePassword, { isLoading, isSuccess }] =
    useChangePasswordMutation();

  const authData = useSelector((state: any) => state.auth);
  const accessToken = authData.accessToken;

  const formik = useFormik<ChangePasswordFormValues>({
    initialValues: {
      accessToken,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await changePassword({
          changePasswordDetails: {
            accessToken: values.accessToken,
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
            confirmPassword: undefined,
          },
        }).unwrap();
        resetForm();
        showToast("Password changed successfully", "success");
      } catch (error: any) {
        showToast(
          error?.data?.message || "Failed to change password!",
          "error"
        );
      }
    },
  });

  if (isSuccess) {
    localStorage.removeItem("persist:auth");
    window.location.href = "/login";
  }

  return (
    <div className="w-full">
      {isForgotPassword ? (
        <EmployeePassWord />
      ) : (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <div className="flex gap-1 mb-2">
              <label className="block text-sm font-medium text-[#73737D]">
                Old Password
              </label>
              <div className="flex items-center relative group pr-3">
                <Info className="w-4 h-4 text-gray-500 cursor-pointer" />

                <div className="absolute left-[-140px] top-full mt-2 hidden w-80 -translate-x-1/2 rounded-md bg-gray-900 text-white text-sm p-3 shadow-lg group-hover:block z-50">
                  Password must contain at least 8 characters, one uppercase
                  letter, one lowercase letter, one number, and one special
                  character.
                  <div className="absolute top-0 right-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-900 rotate-45"></div>
                </div>
              </div>
            </div>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                id="oldPassword"
                autoComplete="old-password"
                value={formik.values.oldPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border p-2 rounded-md focus-visible:outline-none ${
                  formik.touched.oldPassword && formik.errors.oldPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <button
                type="button"
                className="absolute top-1/2 right-2 -translate-y-1/2 text-sm text-[#73737D]"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
            {formik.touched.oldPassword && formik.errors.oldPassword && (
              <p className="text-xs text-red-500 mt-1">
                {formik.errors.oldPassword}
              </p>
            )}
          </div>
          <div>
            <div className="flex gap-1 mb-2">
              <label className="block text-sm font-medium text-[#73737D]">
                New Password
              </label>
              <div className="flex items-center relative group pr-3">
                <Info className="w-4 h-4 text-gray-500 cursor-pointer" />

                <div className="absolute left-[-140px] top-full mt-2 hidden w-80 -translate-x-1/2 rounded-md bg-gray-900 text-white text-sm p-3 shadow-lg group-hover:block z-50">
                  Password must contain at least 8 characters, one uppercase
                  letter, one lowercase letter, one number, and one special
                  character.
                  <div className="absolute top-0 right-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-900 rotate-45"></div>
                </div>
              </div>
            </div>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                id="newPassword"
                autoComplete="new-password"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border p-2 rounded-md focus-visible:outline-none ${
                  formik.touched.newPassword && formik.errors.newPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <button
                type="button"
                className="absolute top-1/2 right-2 -translate-y-1/2 text-sm text-[#73737D]"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
            {formik.touched.newPassword && formik.errors.newPassword && (
              <p className="text-xs text-red-500 mt-1">
                {formik.errors.newPassword}
              </p>
            )}
          </div>
          <div>
            <div className="flex gap-1 mb-2">
              <label className="block text-sm font-medium text-[#73737D]">
                Confirm Password
              </label>
              <div className="flex items-center relative group pr-3">
                <Info className="w-4 h-4 text-gray-500 cursor-pointer" />

                <div className="absolute left-[-140px] top-full mt-2 hidden w-80 -translate-x-1/2 rounded-md bg-gray-900 text-white text-sm p-3 shadow-lg group-hover:block z-50">
                  Password must contain at least 8 characters, one uppercase
                  letter, one lowercase letter, one number, and one special
                  character.
                  <div className="absolute top-0 right-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-900 rotate-45"></div>
                </div>
              </div>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                autoComplete="new-password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border p-2 rounded-md focus-visible:outline-none ${
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <button
                type="button"
                className="absolute top-1/2 right-2 -translate-y-1/2 text-sm text-[#73737D]"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {formik.errors.confirmPassword}
                </p>
              )}
          </div>

          {/* Button Row */}
          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              className="text-sm text-blue-600 underline font-medium"
              onClick={() => setIsForgotPassword(true)}
            >
              Forgot Password
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-b from-[#7E92F8] py-2 px-4 to-[#6972F0] text-white !rounded-md min-w-[100px] flex justify-center"
            >
              {isLoading ? "Changing Password..." : "Change Password"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EmployeePasswordChange;
