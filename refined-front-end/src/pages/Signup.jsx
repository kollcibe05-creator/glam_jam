// src/pages/Signup.jsx
import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";

function Signup({ setUser }) {
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password'), null], "Passwords must match")
      .required("Please confirm password"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      setServerError(null);
      setIsLoading(true);

      fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
        .then((res) => {
          setIsLoading(false);
          if (res.ok) {
            res.json().then((user) => {
              setUser(user);
              navigate("/");
            });
          } else {
            res.json().then((err) => setServerError(err.error || "Signup failed"));
          }
        })
        .catch(() => {
          setIsLoading(false);
          setServerError("Connection lost. Please try again.");
        });
    },
  });

  return (
    <div className="auth-container">
      <div className="form-box">
        <h2>Create an Account</h2>
        <p className="description">Sign up to start exploring and booking homes.</p>

        <form onSubmit={formik.handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.username && formik.errors.username ? "error-border" : ""}
            />
            {formik.touched.username && formik.errors.username && (
              <p className="error-message">{formik.errors.username}</p>
            )}
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.email && formik.errors.email ? "error-border" : ""}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="error-message">{formik.errors.email}</p>
            )}
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.password && formik.errors.password ? "error-border" : ""}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="error-message">{formik.errors.password}</p>
            )}
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.confirmPassword && formik.errors.confirmPassword ? "error-border" : ""}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="error-message">{formik.errors.confirmPassword}</p>
            )}
          </div>

          {serverError && <div className="alert-error">{serverError}</div>}

          <button type="submit" className="btn-primary full-width" disabled={isLoading}>
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
