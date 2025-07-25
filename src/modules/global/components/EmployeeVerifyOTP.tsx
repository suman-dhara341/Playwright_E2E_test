import React, { useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useResendMutation,
  useVerifyMutation,
} from "../../authentication/queries/authenticationQuery";
import { verifyFormValues } from "../../profile/interfaces";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { showToast } from "../../../utilities/toast";
import "../../authentication/css/authentication.css";
import Loading from "../../../utilities/Loading";

const validationSchema = Yup.object().shape({
  code: Yup.string().matches(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

const EmployeeVerifyOTP = () => {
  const navigate = useNavigate();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [verify, { isLoading: verifyIsLoading }] = useVerifyMutation();
  const [resend, { isLoading: resendIsLoading }] = useResendMutation();
  const storedEmail = Cookies.get("email");

  const formik = useFormik<verifyFormValues>({
    initialValues: {
      email: storedEmail || "",
      code: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await verify({
          verifyDetails: {
            email: values.email,
            code: values.code,
          },
        }).unwrap();
        resetForm();
        navigate("/sign-in");
        showToast("Verified successfully!", "success");
      } catch (error: any) {
        showToast(error?.data?.message || "Failed to verify", "error");
      }
    },
  });

  const handleChange = async (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      // Handle pasting a whole OTP
      const updatedCode = formik.values.code.split("");
      updatedCode[index] = value;
      await formik.setFieldValue("code", updatedCode.join(""));

      // Focus on the next field if there's input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      } else if (updatedCode.join("").length === 6) {
        // When all fields are filled, trigger the submit
        const isValid = await formik.validateForm();
        if (Object.keys(isValid).length === 0) {
          formik.handleSubmit();
        }
      }
    }
  };

  const handlePaste = async (event: React.ClipboardEvent) => {
    const pastedText = event.clipboardData.getData("text");
    if (/^\d{6}$/.test(pastedText)) {
      await formik.setFieldValue("code", pastedText);
      const isValid = await formik.validateForm();
      if (Object.keys(isValid).length === 0) {
        formik.handleSubmit();
      }
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (event.key === "Backspace" && !formik.values.code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOTP = async () => {
    if (formik.values.email) {
      try {
        await resend({
          resendDetails: {
            email: formik.values.email,
          },
        }).unwrap();
        showToast("OTP Resent", "success");
      } catch (error: any) {
        showToast(error?.data?.message || "Failed to resend OTP", "error");
      }
    }
  };

  return (
    <div>
      <div className="bg-white p-6 rounded-md w-full">
        <p className="text-2xl font-semibold text-center mb-3 !text-[#3F4354]">
          Verify OTP
        </p>
        <p className="text-center text-[#73737D] mb-3">
          Enter the 6-digit OTP sent to your email
        </p>

        <form onSubmit={formik.handleSubmit}>
          <div className="flex justify-between gap-2 mb-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                name={`code[${index}]`}
                value={formik.values.code[index] || ""}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                maxLength={1}
                className="w-8 h-8 xl:w-12 xl:h-12 text-center text-xl border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          {formik.touched.code && formik.errors.code && (
            <p className="text-red-500 text-center text-sm">
              {formik.errors.code}
            </p>
          )}

          {verifyIsLoading && (
            <div className="flex gap-2 justify-center items-center mt-4">
              <Loading />
              <p className="ml-2 text-[#585DF9]">Verifying OTP...</p>
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="text-gray-600">Didn’t receive the code?</p>
            <button
              type="button"
              onClick={handleResendOTP}
              className="py-2 px-3 mt-1 text-white bg-[#585DF9] rounded disabled:bg-blue-300 min-w-[100px]"
              disabled={resendIsLoading}
            >
              {resendIsLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="w-5 h-5 border-2 border-[white] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <p className="text-white text-sm">Resend OTP</p>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeVerifyOTP;
