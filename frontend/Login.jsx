import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';

function Login({ setUser }) {
    const [serverError, setServerError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const formSchema = yup.object().shape({
        username: yup.string().required("Username is required"),
        password: yup.string().required("Password is required"),
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            setServerError(null);
            setIsLoading(true);
            
            fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            }).then((res) => {
                setIsLoading(false);
                if (res.ok) {
                    res.json().then((user) => {
                        setUser(user);
                        navigate("/"); 
                    });
                } else {
                    res.json().then((err) => setServerError(err.error || "Invalid credentials"));
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
                <h2>Welcome Back</h2>
                <p className="description">Log in to manage your bookings and favorites.</p>
                
                <form onSubmit={formik.handleSubmit}>
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur} // Marks field as touched
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

                    {serverError && <div className="alert-error">{serverError}</div>}

                    <button 
                        type="submit" 
                        className="btn-primary full-width" 
                        disabled={isLoading}
                    >
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