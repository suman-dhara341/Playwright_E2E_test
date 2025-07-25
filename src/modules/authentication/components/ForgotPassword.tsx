import React from "react";
import * as Yup from "yup";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../queries/authenticationQuery";
import { ForgotPasswordFormValues } from "../interfaces";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import AuthBg from "/images/login_bg-none.png";
import "../css/authentication.css";
import { showToast } from "../../../utilities/toast";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .matches(
      /^[A-Za-z0-9][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
      "Invalid email format"
    )
    .required("Email is required"),
});

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const formik = useFormik<ForgotPasswordFormValues>({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response: any = await forgotPassword({
          forgotPasswordDetails: {
            email: values.email,
          },
        }).unwrap();
        resetForm();
        showToast(response?.message || "OTP send successfully", "success");
        if (response?.status === 202) {
          navigate("/login");
        } else {
          navigate("/set-new-password");
        }
      } catch (error: any) {
        showToast(error?.data?.message || "failed to send code", "error");
      }
    },
  });

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
                <p className="text-white text-3xl font-bold mb-3">
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
                    Forgot Password
                  </p>

                  <form onSubmit={formik.handleSubmit}>
                    <p className="my-2 text-red-600 text-xs">
                      [* Indicates mandatory fields]
                    </p>
                    <div className="mb-3 relative">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-[#73737D]"
                      >
                        Email Address *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        autoFocus
                        className={`mt-1 p-[12px] border rounded w-full focus-visible:outline-none ${
                          formik.touched.email && formik.errors.email
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        value={formik.values.email}
                        onChange={(e) => {
                          const lowercaseEmail =
                            e.target.value.toLocaleLowerCase();
                          formik.setFieldValue("email", lowercaseEmail);
                        }}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <p className="text-sm text-red-600 mt-1">
                          {formik.errors.email}
                        </p>
                      )}
                      <div className="flex justify-end absolute right-0 top-0">
                        <button
                          className="text-sm text-[#585DF9]"
                          type="button"
                          onClick={() => navigate("/login")}
                        >
                          Sign In
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 mt-1 text-white bg-[#585DF9] rounded disabled:bg-blue-300"
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

export default ForgotPassword;
