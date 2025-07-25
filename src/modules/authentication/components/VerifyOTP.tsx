import React, { useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { showToast } from "../../../utilities/toast";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  useResendMutation,
  useVerifyMutation,
} from "../queries/authenticationQuery";
import { verifyFormValues } from "../interfaces";
import { motion } from "framer-motion";
import AuthBg from "/images/login_bg-none.png";
import "../css/authentication.css";
import Loading from "../../../utilities/Loading";

const validationSchema = Yup.object().shape({
  code: Yup.string().matches(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

const VerifyOTP = () => {
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
        showToast(error?.data?.message || "Failed to verify!", "error");
      }
    },
  });

  const handleChange = async (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      const updatedCode = formik.values.code.split("");
      updatedCode[index] = value;
      await formik.setFieldValue("code", updatedCode.join(""));
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      } else if (updatedCode.join("").length === 6) {
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
    if (!formik.values.email) {
      try {
        await resend({
          resendDetails: {
            email: formik.values.email.toLocaleLowerCase(),
          },
        }).unwrap();
        showToast("OTP Resent", "success");
      } catch (error: any) {
        showToast(error?.data?.message || "Failed to resend OTP", "error");
      }
    }
  };

  return (
    <>
      <div className="w-[90%] h-[calc(100vh-55px)] bg-[#fafafa] flex flex-col justify-between items-center mx-auto">
        <div className="w-full h-[100vh] flex items-center justify-center gap-3">
          <div className="w-[35%] flex flex-col justify-center items-center relative">
            <p className="text-3xl font-bold text-[#585DF9] absolute top-[-50px] left-[100px]">
              WAZO
            </p>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              src={AuthBg}
              alt="Auth Background"
              className="h-[70vh] w-auto"
            />
          </div>
          <div className="w-[65%]">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full h-[80vh] bg-white rounded-3xl overflow-hidden flex"
              style={{ boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)" }}
            >
              <div className="w-2/5 bg-[#585DF9] flex flex-col justify-center p-6">
                <p className="text-white text-4xl font-bold mb-3">
                  Welcome to WAZO
                </p>
                <p className="text-white text-base">
                  "Experience a culture where you feel noticed, supported, your
                  achievements are celebrated, you grow together through
                  recognitions, feedback, awards, badges, and inspired to
                  thrive."
                </p>
              </div>

              <div className="w-3/5 bg-white backdrop-blur-lg py-10 flex flex-col justify-center relative">
                <div className="p-6">
                  <div className="mx-auto bg-[#585DF9] rounded-full w-10 h-10 flex items-center justify-center mb-2">
                    <LockOutlinedIcon className="text-white" />
                  </div>
                  <p className="text-2xl text-center font-semibold tracking-[0px] text-[#3F4354]">
                    Verify OTP
                  </p>
                  <p className="text-center text-gray-600 mb-3">
                    Enter the 6-digit OTP sent to your email from <br />
                    <span className="text-[#585DF9]">
                      no-reply@verificationemail.com
                    </span>
                  </p>
                  <form
                    onSubmit={formik.handleSubmit}
                    className="w-[70%] mx-auto"
                  >
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
                      <p className="text-gray-600 mb-2">
                        Didn’t receive the code?
                      </p>
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        className="w-full py-3 mt-1 text-white bg-[#585DF9] rounded disabled:bg-blue-300"
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
                <div className="w-full bg-blue-100 mt-3 flex gap-1 justify-center py-3 absolute bottom-0">
                  <p className="text-base text-[#73737D]">
                    Don’t have an account?
                  </p>
                  <button
                    className="font-bold text-[#585DF9]"
                    type="button"
                    onClick={() => navigate(`/sign-up`)}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <footer className="w-[80%] py-3 mx-auto">
        <div className="text-start">
          <p className="text-sm text-black">
            © 2025 | Wazo Solutions Pvt Ltd. All rights reserved
          </p>
        </div>
      </footer>
    </>
  );
};

export default VerifyOTP;
