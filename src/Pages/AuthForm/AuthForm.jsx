import React, { useEffect, useState, useRef, useContext } from "react";
import { useForm } from "react-hook-form";
import "./AuthForm.css";
// Import the publicApi instance
import { publicApi } from "../../Services/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BasicSettingsContext } from "../../App";

 function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
    const BasicSettingsContextObj = useContext(BasicSettingsContext);
    const setIsAuthenticated = BasicSettingsContextObj?.setIsAuthenticated;
  const setCurrentUserData = BasicSettingsContextObj?.setCurrentUserData;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({ mode: "onChange" });
  const [backendErrors, setBackendErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const username = watch("username", "");
  const password = watch("password", "");
  const debounceTimeout = useRef();
  const navigate = useNavigate();
  const toggleForm = () => {
    setIsLogin(!isLogin);
    reset();
    setBackendErrors({});
    setLoginError("");
  };

  useEffect(() => {
    if (!username || isLogin) {
      setBackendErrors((prev) => ({ ...prev, username: [] }));
      return;
    }
    const usernamePattern = /^[a-zA-Z0-9_]+$/;
    if (!usernamePattern.test(username)) {
      return; // Let react-hook-form handle this error
    }

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
      try {
        // Use publicApi for remote username check
        const res = await publicApi.get(
          `/api/user-check?username=${username}`
        );
        if (res.data.user_data != null) {
          setBackendErrors((prev) => ({
            ...prev,
            username: ["Username already exists. Choose a different username."],
          }));
        } else {
          setBackendErrors((prev) => ({ ...prev, username: [] }));
        }
      } catch (err) {
        setBackendErrors((prev) => ({ ...prev, username: [] }));
      }
    }, 500);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [username, isLogin]);

  const onSubmit = async (data) => {
    setBackendErrors({});
    setLoginError("");

    if (isLogin) {
      try {
        // Use publicApi for login
        const response = await publicApi.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/login`,
          {
            username: data.username,
            password: data.password,
            remember_me: data.remember_me || false,
          }
        );

        if (response.status === 200 && response.data.accessToken) {
          localStorage.setItem("accessToken", response.data.accessToken);
          sessionStorage.setItem("showWelcomeMessage", "true");
          toast.success("Login Successful");
          // Set the current user data in context
         if (setIsAuthenticated && setCurrentUserData) {
            setIsAuthenticated(true);
            setCurrentUserData(response.data.user_data); 
          }
         


          const userRole = response.data.user_data?.role;


          const redirectPath = userRole === "admin" ? "/admin/dashboard" : "/";

          setTimeout(() => {
            navigate(redirectPath);
          }, 1500);
        }
      } catch (error) {
    
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
          setLoginError(error.response.data.message);
        } else {
          setLoginError("Login failed. Please try again.");
        }
      }
    } else {
      try {
        const formData = new FormData();
        formData.append("username", String(data.username));
        formData.append("email", data.email || "");
        formData.append("password", data.password || "");
        formData.append("confirm_password", data.confirm_password || "");
        formData.append("contact_number", data.contact_number || "");
        formData.append("address", data.address || "");
        formData.append("gender", data.gender || "");
        if (data.profile_image && data.profile_image.length > 0) {
          formData.append("profile_image", data.profile_image[0]);
        }

        // Use publicApi for registration
        const userSaveResponse = await publicApi.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/register`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (userSaveResponse.data != null) {
          toast.success("User registered successfully!", { icon: "🎉" });
          reset();
        }
      } catch (error) {
					if (error.response && error.response.status === 409) {
            toast.error("Email already exists. Please use a different email.");
						return;
          }
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const newErrors = {};
          error.response.data.errors.forEach((err) => {
            newErrors[err.path] = newErrors[err.path]
              ? [...newErrors[err.path], err.msg]
              : [err.msg];
          });
          setBackendErrors(newErrors);
        } else {
          toast.error("Registration failed. Please try again.");
        }
      }
    }
  };

  const loginPasswordRules = {
    required: "Password is required",
  };

  const registerPasswordRules = {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters",
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
      message:
        "Password must contain one uppercase letter, one lowercase letter, and one digit.",
    },
  };

  return (
    <div className="auth-form-container">
      <Toaster position="top-right" />
      <div className="auth-box">
        <h2>{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Username input */}
          <div
            className={`input-group${
              errors.username ||
              (backendErrors.username && backendErrors.username.length)
                ? " error"
                : ""
            }`}
          >
            <label>Username</label>
            <input
              type="text"
              placeholder="Your Username"
              {...register("username", {
                required: "Username is required",
                minLength: !isLogin && {
                  value: 3,
                  message: "Username must be 3-20 characters",
                },
                maxLength: !isLogin && {
                  value: 20,
                  message: "Username must be 3-20 characters",
                },
                pattern: !isLogin && {
                  value: /^[a-zA-Z0-9_]+$/,
                  message:
                    "Username can only contain letters, numbers, and underscores",
                },
              })}
            />
            {/* Display react-hook-form errors */}
            {errors.username && (
              <span className="error">{errors.username.message}</span>
            )}
            {/* Display backend errors */}
            {backendErrors.username &&
              backendErrors.username.map((err, i) => (
                <span className="error" key={i}>
                  {err}
                </span>
              ))}
          </div>

          {!isLogin && (
            <>
              <div
                className={`input-group${
                  errors.email ||
                  (backendErrors.email && backendErrors.email.length)
                    ? " error"
                    : ""
                }`}
              >
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Your Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email format",
                    },
                  })}
                />
                {errors.email && (
                  <span className="error">{errors.email.message}</span>
                )}
                {backendErrors.email &&
                  backendErrors.email.map((err, i) => (
                    <span className="error" key={i}>
                      {err}
                    </span>
                  ))}
              </div>
              <div
                className={`input-group${
                  errors.profile_image ? " error" : ""
                }`}
              >
                <label>Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("profile_image")}
                />
                {errors.profile_image && (
                  <span className="error">{errors.profile_image.message}</span>
                )}
              </div>
              <div className={`input-group${errors.gender ? " error" : ""}`}>
                <label>Gender</label>
                <select
                  {...register("gender", { required: "Gender is required" })}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <span className="error">{errors.gender.message}</span>
                )}
              </div>
              <div
                className={`input-group${
                  errors.contact_number ||
                  (backendErrors.contact_number &&
                    backendErrors.contact_number.length)
                    ? " error"
                    : ""
                }`}
              >
                <label>Contact Number</label>
                <input
                  type="tel"
                  placeholder="Your Contact Number"
                  {...register("contact_number", {
                    required: "Contact number is required",
                    pattern: {
                      value: /^(\+?\d{1,4}[ -]?)?(\d{10})$/,
                      message: "Invalid phone number",
                    },
                  })}
                />
                {errors.contact_number && (
                  <span className="error">{errors.contact_number.message}</span>
                )}
                {backendErrors.contact_number &&
                  backendErrors.contact_number.map((err, i) => (
                    <span className="error" key={i}>
                      {err}
                    </span>
                  ))}
              </div>
              <div
                className={`input-group${
                  errors.address ||
                  (backendErrors.address && backendErrors.address.length)
                    ? " error"
                    : ""
                }`}
              >
                <label>Address</label>
                <input
                  type="text"
                  placeholder="Your Address"
                  {...register("address", {
                    required: "Address is required",
                    minLength: {
                      value: 5,
                      message: "Address must be between 5 and 100 characters",
                    },
                    maxLength: {
                      value: 100,
                      message: "Address must be between 5 and 100 characters",
                    },
                  })}
                />
                {errors.address && (
                  <span className="error">{errors.address.message}</span>
                )}
                {backendErrors.address &&
                  backendErrors.address.map((err, i) => (
                    <span className="error" key={i}>
                      {err}
                    </span>
                  ))}
              </div>
            </>
          )}

          {/* Password input */}
          <div
            className={`input-group${
              errors.password ||
              (backendErrors.password && backendErrors.password.length)
                ? " error"
                : ""
            }`}
          >
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password", isLogin ? loginPasswordRules : registerPasswordRules)}
            />
            {errors.password && (
              <span className="error">{errors.password.message}</span>
            )}
            {backendErrors.password &&
              backendErrors.password.map((err, i) => (
                <span className="error" key={i}>
                  {err}
                </span>
              ))}
          </div>

          {!isLogin && (
            <div
              className={`input-group${
                errors.confirm_password ||
                (backendErrors.confirm_password &&
                  backendErrors.confirm_password.length)
                  ? " error"
                  : ""
              }`}
            >
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                {...register("confirm_password", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              {errors.confirm_password && (
                <span className="error">{errors.confirm_password.message}</span>
              )}
              {backendErrors.confirm_password &&
                backendErrors.confirm_password.map((err, i) => (
                  <span className="error" key={i}>
                    {err}
                  </span>
                ))}
            </div>
          )}

          {isLogin && (
            <div className="input-group remember-me-group">
              <label>
                <input
                  type="checkbox"
                  {...register("remember_me")}
                  style={{ width: "1em", height: "1em" }}
                />
                Remember Me
              </label>
            </div>
          )}

          <button type="submit" className="btn">
            {isLogin ? "Login" : "Register"}
          </button>
          {loginError && <span className="error">{loginError}</span>}
          {backendErrors.general &&
            backendErrors.general.map((err, i) => (
              <span className="error" key={i}>
                {err}
              </span>
            ))}
        </form>
        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={toggleForm}>{isLogin ? "Register" : "Login"}</span>
        </p>
      </div>
    </div>
  );
}

export default AuthForm;