import React, { useState } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useSignInMutation } from "../queries/authenticationQuery";
import { SignInFormValues } from "../interfaces";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../slice/index";
import { jwtDecode } from "jwt-decode";
import { showToast } from "../../../utilities/toast";
import { Eye, EyeOff, Info } from "lucide-react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { motion } from "framer-motion";
import AuthBg from "/images/login_bg-none.png";
import "../css/authentication.css";
import Cookies from "js-cookie";
import { requestPermission } from "../../../firebase/NotificationService";

const passwordHints = [
  { regex: /.{8,}/, label: "8 characters or longer" },
  { regex: /[a-z]/, label: "At least one lowercase letter" },
  { regex: /[A-Z]/, label: "At least one uppercase letter" },
  { regex: /\d/, label: "At least one number" },
  { regex: /[^A-Za-z0-9]/, label: "At least one special character" },
];

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .matches(
      /^[A-Za-z0-9][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
      "Invalid email format"
    )
    .required("Email is required"),
  password: Yup.string()
    .trim()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])(?=\S.*\S).{8,}$/,
      "Password does not meet the criteria"
    )
    .required("Password is required"),
});

const waitForFcmToken = (
  maxWaitTime = 2000,
  interval = 100
): Promise<string> => {
  return new Promise((resolve) => {
    const startTime = Date.now();

    const checkToken = async () => {
      const token = localStorage.getItem("fcmToken");
      if (token) {
        return resolve(token);
      }

      const elapsed = Date.now() - startTime;
      if (elapsed >= maxWaitTime) {
        try {
          await requestPermission();
          setTimeout(() => {
            const newToken = localStorage.getItem("fcmToken");
            if (newToken) {
              resolve(newToken);
            } else {
              resolve("");
            }
          }, 500);
        } catch {
          resolve("");
        }
      } else {
        setTimeout(checkToken, interval);
      }
    };
    checkToken();
  });
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signIn, { isLoading }] = useSignInMutation();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isWaitingForFcmToken, setIsWaitingForFcmToken] = useState(false);

  const formik = useFormik<SignInFormValues>({
    initialValues: {
      email: "",
      password: "",
      fcmToken: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsWaitingForFcmToken(true); // <-- start loader before token wait
      try {
        const token = await waitForFcmToken();
        setIsWaitingForFcmToken(false); // <-- done waiting

        Cookies.set("tempemailId", values.email, { expires: 0.00347 });

        const response: any = await signIn({
          signInDetails: {
            ...values,
            fcmToken: token,
          },
        }).unwrap();

        const { accessToken, refreshToken, expiresIn, idToken } = response.data;
        const decodedUserData = jwtDecode(idToken);

        const payload: any = {
          accessToken,
          refreshToken,
          expiresIn,
          idToken,
          userData: decodedUserData,
        };

        dispatch(loginSuccess(payload));
        resetForm();
        navigate("/feed");
      } catch (error: any) {
        setIsWaitingForFcmToken(false); // <-- also stop loader on failure
        const errorMessage = error?.data?.message || "Failed to sign in!";

        if (error?.status === 409) {
          const session = error?.data?.data?.session;
          if (session) {
            localStorage.setItem("sessionData", session);
          }
          showToast("Password reset required", "warning");
          navigate("/change-temporary-password");
        } else {
          showToast(errorMessage, "error");
        }
      }
    },
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    formik.setFieldValue("password", e.target.value);
    setPasswordTouched(true);
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

              <div className="w-3/5 bg-white backdrop-blur-lg py-10 flex flex-col justify-center relative">
                <div className="p-6">
                  <div className="mx-auto bg-[#585DF9] rounded-full w-10 h-10 flex items-center justify-center mb-2">
                    <LockOutlinedIcon className="text-white" />
                  </div>
                  <p className="text-2xl text-center font-semibold tracking-[0px] text-[#3F4354]">
                    Sign In
                  </p>
                  <p className="text-center text-gray-500 mb-3 text-sm">
                    Glad to see you again, let’s pick up where you left off!
                  </p>

                  <form onSubmit={formik.handleSubmit} className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-[#73737D]">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formik.values.email}
                        onChange={(e) =>
                          formik.setFieldValue(
                            "email",
                            e.target.value.toLocaleLowerCase()
                          )
                        }
                        onBlur={formik.handleBlur}
                        className={`mt-1 w-full p-[12px] rounded-md border text-sm focus-visible:outline-none ${
                          formik.touched.email && formik.errors.email
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:outline-none`}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <p className="text-xs text-red-600 mt-1">
                          {formik.errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between">
                        <label className="text-sm font-medium text-[#73737D]">
                          Password
                        </label>
                        <button
                          className="text-sm text-[#585DF9]"
                          type="button"
                          onClick={() => navigate("/forgot-password")}
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formik.values.password}
                          onChange={handlePasswordChange}
                          onBlur={formik.handleBlur}
                          className={`mt-1 w-full p-[12px] rounded-md border text-sm focus-visible:outline-none ${
                            formik.touched.password && formik.errors.password
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:outline-none`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-5 text-gray-600"
                        >
                          {showPassword ? (
                            <Eye size={18} />
                          ) : (
                            <EyeOff size={18} />
                          )}
                        </button>
                      </div>
                      {formik.touched.password && formik.errors.password && (
                        <p className="text-xs text-red-600 mt-1">
                          {formik.errors.password}
                        </p>
                      )}
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

                    <button
                      type="submit"
                      disabled={isLoading || isWaitingForFcmToken}
                      className="w-full py-3 mt-1 text-white bg-[#585DF9] rounded disabled:bg-blue-300 mt-2"
                    >
                      {isLoading || isWaitingForFcmToken ? (
                        <div className="flex justify-center">
                          <div className="w-5 h-5 border-2 border-[white] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : (
                        <p className="text-sm">Sign In</p>
                      )}
                    </button>

                    <div className="flex justify-between items-center">
                      <p className="mt-3 text-sm text-[#73737D]">
                        By continuing, you agree to our{" "}
                        <span className="text-[#585DF9] underline underline-offset-1">
                          Terms of Service
                        </span>{" "}
                        and{" "}
                        <span className="text-[#585DF9] underline underline-offset-1">
                          Privacy Policy
                        </span>
                      </p>
                    </div>
                  </form>
                </div>
                <div className="w-full bg-blue-100 mt-3 flex gap-1 justify-center py-3 absolute bottom-0">
                  <p className="text-sm text-[#73737D]">
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

export default Login;
