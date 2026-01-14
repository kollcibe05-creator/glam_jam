import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";

function Login({ setUser }) {
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const schema = yup.object({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: schema,
    onSubmit: async (values) => {
      setServerError(null);
      setIsLoading(true);

      try {
        const res = await fetch("/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          const errData = await res.json();
          setServerError(errData.error || "Invalid credentials");
          return;
        }

        const user = await res.json();
        setUser(user);
        navigate("/"); // redirect to home
      } catch (err) {
        setServerError("Connection lost. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="auth-container">
      <div className="form-box">
        <h2>Welcome Back</h2>
        <p className="description">Log in to manage your bookings and favorites.</p>

        <form onSubmit={formik.handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              {...formik.getFieldProps("username")}
              className={formik.touched.username && formik.errors.username ? "error-border" : ""}
            />
            {formik.touched.username && formik.errors.username && (
              <p className="error-message">{formik.errors.username}</p>
            )}
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              {...formik.getFieldProps("password")}
              className={formik.touched.password && formik.errors.password ? "error-border" : ""}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="error-message">{formik.errors.password}</p>
            )}
          </div>

          {serverError && <div className="alert-error">{serverError}</div>}

          <button type="submit" className="btn-primary full-width" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
