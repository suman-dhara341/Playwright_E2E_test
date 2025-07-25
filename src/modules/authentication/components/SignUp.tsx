import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { SignUpFormValues } from "../interfaces";
import { useSignUpMutation } from "../queries/authenticationQuery";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { showToast } from "../../../utilities/toast";
import AuthBg from "/images/login_bg-none.png";
import "../css/authentication.css";
import { Eye, EyeOff, Info } from "lucide-react";

const passwordHints = [
  { regex: /.{8,}/, label: "8 characters or longer" },
  { regex: /[a-z]/, label: "At least one lowercase letter" },
  { regex: /[A-Z]/, label: "At least one uppercase letter" },
  { regex: /\d/, label: "At least one number" },
  { regex: /[^A-Za-z0-9]/, label: "At least one special character" },
];

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  companyName: Yup.string().required("Company name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .trim()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])(?=\S.*\S).{8,}$/,
      "Password does not meet the criteria"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Confirm password must match the password.")
    .required("Confirm Password is required"),
});

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signUp, { isLoading }] = useSignUpMutation();
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [promoCode, setPromoCode] = useState("");
  const [isPromoValid, setIsPromoValid] = useState(false);
  const [promoError, setPromoError] = useState("");

  const validatePromoCode = () => {
    if (promoCode.trim() === "") {
      setPromoError("Promo code is required.");
      return;
    }
    if (promoCode === "#Wazo@Onboarding#") {
      setIsPromoValid(true);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code. Please enter a valid one.");
    }
  };

  const formik = useFormik<SignUpFormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      companyName: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await signUp({
          signUpDetails: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            companyName: values.companyName,
            password: values.password,
            confirmPassword: values.confirmPassword,
          },
        }).unwrap();
        Cookies.set("email", values.email, { expires: 1 });
        resetForm();
        showToast("Successfully sign-up", "success");
        navigate("/verify");
      } catch (error: any) {
        showToast(error?.data?.message || "Failed to sign up!", "error");
      }
    },
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    formik.setFieldValue("password", e.target.value);
    setPasswordTouched(true);
  };

  const handleSignInRedirect = () => {
    navigate("/login");
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
              <div className="w-2/5 bg-[#585DF9] flex flex-col justify-center p-3">
                <p className="text-white text-3xl font-bold mb-2">
                  Welcome to WAZO
                </p>
                <p className="text-white text-base">
                  "Experience a culture where you feel noticed, supported, your
                  achievements are celebrated, you grow together through
                  recognitions, feedback, awards, badges, and inspired to
                  thrive."
                </p>
              </div>

              {!isPromoValid ? (
                <div className="w-3/5 bg-white backdrop-blur-lg flex flex-col justify-center">
                  <div>
                    <div className="mx-auto bg-[#585DF9] rounded-full w-10 h-10 flex items-center justify-center mb-2">
                      <LockOutlinedIcon className="text-white" />
                    </div>
                    <p className="text-2xl text-center font-semibold tracking-[0px] text-[#3F4354]">
                      Sign Up
                    </p>
                    <p className="text-center text-gray-500 mb-3 text-sm">
                      Your future self will thank you!
                    </p>

                    <div className="space-y-2 mb-12 p-3">
                      <label className="text-sm font-medium text-[#73737D]">
                        Invite Code
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Code"
                        className="w-full p-[12px] rounded-md border text-sm focus-visible:outline-none"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      {promoError && (
                        <p className="text-red-500 text-sm">{promoError}</p>
                      )}
                      <button
                        onClick={validatePromoCode}
                        className="w-full py-3 mt-3 mb-1 text-white bg-[#585DF9] rounded disabled:bg-blue-300 mt-2"
                      >
                        Apply Code
                      </button>
                      <p className="text-sm text-gray-600 text-center">
                        To begin the onboarding process & get invite code, please 
                        <a
                          href="https://www.wazopulse.com/contact"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="!text-blue-600 !hover:underline cursor-pointer font-medium"
                        >
                          {" "}click here{" "}
                        </a>
                        to contact our administrator.
                      </p>
                    </div>
                    <div className="w-full bg-blue-100 mt-3 flex gap-1 justify-center py-3 absolute bottom-0">
                      <p className="text-sm text-[#73737D]">
                        If you already have an account?
                      </p>
                      <button
                        className="font-bold text-[#585DF9]"
                        type="button"
                        onClick={handleSignInRedirect}
                      >
                        Sign In
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-3/5 bg-white backdrop-blur-lg flex flex-col justify-center">
                  <div>
                    <div className="mx-auto bg-[#585DF9] rounded-full w-10 h-10 flex items-center justify-center mb-2">
                      <LockOutlinedIcon className="text-white" />
                    </div>
                    <p className="text-2xl text-center font-semibold tracking-[0px] text-[#3F4354]">
                      Sign Up
                    </p>
                    <p className="text-center text-gray-500 mb-3 text-sm">
                      Your future self will thank you!
                    </p>
                    <form
                      onSubmit={formik.handleSubmit}
                      className="space-y-2 mb-12 p-3"
                    >
                      <div className="flex gap-3">
                        <div className="w-full">
                          <label className="text-sm font-medium text-[#73737D]">
                            Company Name
                          </label>
                          <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            className={`mt-1 w-full p-[12px] rounded-md border text-sm focus-visible:outline-none ${
                              formik.touched.companyName &&
                              formik.errors.companyName
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:outline-none`}
                            value={formik.values.companyName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.companyName &&
                            formik.errors.companyName && (
                              <p className="text-red-600 text-xs mt-1">
                                {formik.errors.companyName}
                              </p>
                            )}
                        </div>
                        <div className="w-full">
                          <label className="text-sm font-medium text-[#73737D]">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            className={`mt-1 w-full p-[12px] rounded-md border text-sm focus-visible:outline-none ${
                              formik.touched.email && formik.errors.email
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:outline-none`}
                            value={formik.values.email}
                            onChange={(e) =>
                              formik.setFieldValue(
                                "email",
                                e.target.value.toLocaleLowerCase()
                              )
                            }
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.email && formik.errors.email && (
                            <p className="text-red-600 text-xs mt-1">
                              {formik.errors.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-full">
                          <label className="text-sm font-medium text-[#73737D]">
                            First Name
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            className={`mt-1 w-full p-[12px] rounded-md border text-sm focus-visible:outline-none ${
                              formik.touched.firstName &&
                              formik.errors.firstName
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:outline-none`}
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.firstName &&
                            formik.errors.firstName && (
                              <p className="text-red-600 text-xs mt-1">
                                {formik.errors.firstName}
                              </p>
                            )}
                        </div>
                        <div className="w-full">
                          <label className="text-sm font-medium text-[#73737D]">
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            className={`mt-1 w-full p-[12px] rounded-md border text-sm focus-visible:outline-none ${
                              formik.touched.lastName && formik.errors.lastName
                                ? "border-red-500"
                                : "border-gray-300"
                            } focus:outline-none`}
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          {formik.touched.lastName &&
                            formik.errors.lastName && (
                              <p className="text-red-600 text-xs mt-1">
                                {formik.errors.lastName}
                              </p>
                            )}
                        </div>
                      </div>
                      <div>
                        <div className="flex gap-3 mb-2">
                          <div className="w-full">
                            <div className="flex gap-1">
                              <label className="text-sm font-medium text-[#73737D]">
                                Password
                              </label>
                              <div className="flex items-center relative group pr-3">
                                <Info className="w-4 h-4 text-gray-500 cursor-pointer" />

                                <div className="absolute left-[-140px] top-full mt-2 hidden w-80 -translate-x-1/2 rounded-md bg-gray-900 text-white text-sm p-3 shadow-lg group-hover:block z-50">
                                  Password must contain at least 8 characters,
                                  one uppercase letter, one lowercase letter,
                                  one number, and one special character.
                                  <div className="absolute top-0 right-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-900 rotate-45"></div>
                                </div>
                              </div>
                            </div>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                className={`mt-1 w-full p-[12px] rounded-md border text-sm focus-visible:outline-none ${
                                  formik.touched.password &&
                                  formik.errors.password
                                    ? "border-red-500"
                                    : "border-gray-300"
                                } focus:outline-none`}
                                value={formik.values.password}
                                onChange={handlePasswordChange}
                                onBlur={formik.handleBlur}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-5 text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <Eye size={18} />
                                ) : (
                                  <EyeOff size={18} />
                                )}
                              </button>
                            </div>
                            {formik.touched.password &&
                              formik.errors.password && (
                                <p className="text-red-600 text-xs mt-1">
                                  {formik.errors.password}
                                </p>
                              )}
                          </div>

                          <div className="w-full">
                            <label className="text-sm font-medium text-[#73737D]">
                              Confirm Password
                            </label>
                            <div className="relative">
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                className={`mt-1 w-full p-[12px] rounded-md border text-sm focus-visible:outline-none ${
                                  formik.touched.confirmPassword &&
                                  formik.errors.confirmPassword
                                    ? "border-red-500"
                                    : "border-gray-300"
                                } focus:outline-none`}
                                value={formik.values.confirmPassword}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-5 text-gray-600"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                              >
                                {showConfirmPassword ? (
                                  <Eye size={18} />
                                ) : (
                                  <EyeOff size={18} />
                                )}
                              </button>
                            </div>
                            {formik.touched.confirmPassword &&
                              formik.errors.confirmPassword && (
                                <p className="text-red-600 text-xs mt-1">
                                  {formik.errors.confirmPassword}
                                </p>
                              )}
                          </div>
                        </div>
                        {passwordTouched && (
                          <ul className="flex flex-wrap gap-1 m-0 p-0">
                            {passwordHints
                              .filter(
                                (hint) => !isPasswordHintSatisfied(hint.regex)
                              )
                              .map((hint, index) => (
                                <li
                                  key={index}
                                  className="text-xs text-red-600 flex items-center gap-1"
                                >
                                  <Info className="w-4 h-4" /> {hint.label}
                                </li>
                              ))}
                          </ul>
                        )}
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 mt-1 text-white bg-[#585DF9] rounded disabled:bg-blue-300 mt-2"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex justify-center">
                            <div className="w-5 h-5 border-2 border-[white] border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        ) : (
                          <p className="text-sm">Sign Up</p>
                        )}
                      </button>
                    </form>
                  </div>
                  <div className="w-full bg-blue-100 mt-3 flex gap-1 justify-center py-3 absolute bottom-0">
                    <p className="text-sm text-[#73737D]">
                      If you already have an account?
                    </p>
                    <button
                      className="font-bold text-[#585DF9]"
                      type="button"
                      onClick={handleSignInRedirect}
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              )}
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

export default SignUp;
