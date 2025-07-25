import React, { useState } from "react";
import * as Yup from "yup";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { useChangeTempPasswordMutation } from "../queries/authenticationQuery";
import { SetNewTempPasswordFormValues } from "../interfaces";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import AuthBg from "/images/login_bg-none.png";
import "../css/authentication.css";
import { showToast } from "../../../utilities/toast";
import { Info } from "lucide-react";
import Cookies from "js-cookie";

const passwordHints = [
  { regex: /.{8,}/, label: "8 characters or longer" },
  { regex: /[a-z]/, label: "At least one lowercase letter" },
  { regex: /[A-Z]/, label: "At least one uppercase letter" },
  { regex: /\d/, label: "At least one number" },
  {
    // Special characters allowed: !@#$%^&*()-_=+[]{}|;:'",.<>?/
    regex: /[!@#$%^&*()\-_=+\[\]{}|;:'",.<>?\/]/,
    label: "At least one special character",
  },
];

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .matches(
      /^[A-Za-z0-9][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
      "Invalid email format"
    )
    .required("Email is required"),
  newPassword: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])(?=\S.*\S).{8,}$/,
      "The password does not meet the specified criteria"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref("newPassword")],
      "Confirm password must match the new password."
    )
    .required("Confirm password is required"),
});

const TempPasswordChange: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>("");
  const [setNewPassword, { isLoading }] = useChangeTempPasswordMutation();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const sessionData = localStorage.getItem("sessionData") ?? "";

  const formik = useFormik<SetNewTempPasswordFormValues>({
    initialValues: {
      email: Cookies.get("tempemailId") || "",
      newPassword: "",
      confirmPassword: "",
      session: sessionData,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await setNewPassword({
          changePasswordDetails: {
            email: values.email,
            newPassword: values.newPassword,
            session: values.session,
            confirmPassword: values.confirmPassword,
          },
        });

        resetForm();
        showToast("Password changed successfully", "success");
        navigate("/sign-in");
      } catch (error: any) {
        showToast(
          error?.data?.message || "Failed to change password!",
          "error"
        );
      }
    },
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    formik.handleChange(e);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const isPasswordHintSatisfied = (regex: RegExp) => regex.test(password);

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

              <div className="w-3/5 bg-white backdrop-blur-lg flex flex-col justify-center">
                <div>
                  <div className="mx-auto bg-[#585DF9] rounded-full w-10 h-10 flex items-center justify-center mb-2">
                    <LockOutlinedIcon className="text-white" />
                  </div>
                  <p className="text-2xl text-center font-semibold tracking-[0px] text-[#3F4354]">
                    Change Temporary Password
                  </p>
                  <form
                    onSubmit={formik.handleSubmit}
                    className="space-y-2 mb-12 p-3"
                  >
                    <div>
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-[#73737D]"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={formik.values.email.toLocaleLowerCase()}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`mt-1 p-[12px] border rounded w-full focus-visible:outline-none ${
                          formik.touched.email && formik.errors.email
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        aria-label="email address input"
                        readOnly
                      />
                      {formik.touched.email && formik.errors.email && (
                        <p className="text-sm text-red-500 mt-1">
                          {formik.errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="text-sm font-medium text-[#73737D]"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="newPassword"
                          autoComplete="current-password"
                          value={formik.values.newPassword}
                          onChange={handlePasswordChange}
                          onBlur={formik.handleBlur}
                          className={`mt-1 p-[12px] border rounded w-full focus-visible:outline-none ${
                            formik.touched.newPassword &&
                            formik.errors.newPassword
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          aria-label="password input"
                        />
                        <button
                          type="button"
                          onClick={toggleShowPassword}
                          className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </button>
                      </div>
                      {formik.touched.newPassword &&
                        formik.errors.newPassword && (
                          <p className="text-sm text-red-500 mt-1">
                            {formik.errors.newPassword}
                          </p>
                        )}
                    </div>

                    <div>
                      <label
                        htmlFor="confirm-password"
                        className="text-sm font-medium text-[#73737D]"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirm-password"
                          name="confirmPassword"
                          autoComplete="new-password"
                          value={formik.values.confirmPassword}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`mt-1 p-[12px] border rounded w-full focus-visible:outline-none ${
                            formik.touched.confirmPassword &&
                            formik.errors.confirmPassword
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={toggleShowConfirmPassword}
                          className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                          aria-label="toggle confirm password visibility"
                        >
                          {showConfirmPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </button>
                      </div>
                      {formik.touched.confirmPassword &&
                        formik.errors.confirmPassword && (
                          <p className="text-sm text-red-500 mt-1">
                            {formik.errors.confirmPassword}
                          </p>
                        )}
                    </div>

                    <ul className="flex flex-wrap gap-1 mt-2 p-0">
                      {passwordHints
                        .filter((hint) => !isPasswordHintSatisfied(hint.regex))
                        .map((hint, index) => (
                          <li
                            key={index}
                            className="text-xs text-red-600 flex items-center gap-1"
                          >
                            <Info className="w-4 h-4" /> {hint.label}
                          </li>
                        ))}
                    </ul>

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
                        <p className="text-white text-sm">Change Password</p>
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

export default TempPasswordChange;
