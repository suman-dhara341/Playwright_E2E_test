import * as Yup from "yup";
import { useForgotPasswordMutation } from "../../authentication/queries/authenticationQuery";
import { ForgotPasswordFormValues } from "../../profile/interfaces";
import { useFormik } from "formik";
import { showToast } from "../../../utilities/toast";
import "../../authentication/css/authentication.css";
import Cookies from "js-cookie";
import { useState } from "react";
import EmployeeVerifyOTP from "./EmployeeVerifyOTP";
import { useSelector } from "react-redux";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .matches(
      /^[A-Za-z0-9][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
      "Invalid email format"
    )
    .required("Email is required"),
});

const EmployeePassWord = () => {
  const EMAIL = useSelector((state: any) => state.auth.userData.email);
  const [emailSend, setEmailSend] = useState(true);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const formik = useFormik<ForgotPasswordFormValues>({
    initialValues: {
      email: EMAIL,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await forgotPassword({
          forgotPasswordDetails: {
            email: values.email,
          },
        }).unwrap();
        Cookies.set("email", values.email, { expires: 1 });
        resetForm();
        setEmailSend(false);
        showToast("Code sent to your email", "success");
      } catch (error: any) {
        showToast(error?.data?.message || "Code sending failed", "error");
      }
    },
  });

  return (
    <>
      {emailSend ? (
        <div>
          <p className="block text-[#73737D] text-base font-semibold mb-1">
            Forgot Password
          </p>

          <form onSubmit={formik.handleSubmit} className="">
            <p className="text-xs text-red-600 mb-3">
              [* Indicates mandatory fields]
            </p>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#73737D] mb-1"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your email"
                autoComplete="email"
                autoFocus
                className={`w-full border p-2 rounded-md focus-visible:outline-none ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:border-blue-500`}
              />
              {formik.touched.email && formik.errors.email && (
                <span className="text-xs text-red-500 mt-1">
                  {formik.errors.email}
                </span>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-gradient-to-b from-[#7E92F8] py-2 px-4 to-[#6972F0] text-white !rounded-md mt-3 min-w-[100px]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="w-5 h-5 border-2 border-[white] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <p className="text-white text-sm">Send code</p>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <EmployeeVerifyOTP />
      )}
    </>
  );
};

export default EmployeePassWord;
