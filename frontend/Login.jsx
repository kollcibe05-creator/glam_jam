import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';

function Login({ setUser }) {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 1. Define Validation Schema
    const formSchema = yup.object().shape({
        username: yup.string().required("Username is required"),
        password: yup.string().required("Password is required"),
    });

    // 2. Initialize Formik
    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            setError(null);
            fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            }).then((res) => {
                if (res.ok) {
                    res.json().then((user) => {
                        setUser(user); // Set global user state in App.jsx
                        navigate("/"); // Redirect to home gallery
                    });
                } else {
                    res.json().then((err) => setError(err.error));
                }
            });
        },
    });

    return (
        <div className="form-box">
            <h2>Welcome Back</h2>
            <p className="description">Log in to manage your bookings and favorites.</p>
            
            <form onSubmit={formik.handleSubmit}>
                <label>Username</label>
                <input
                    type="text"
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    className={formik.errors.username ? "error-border" : ""}
                />
                {formik.errors.username && <p className="error">{formik.errors.username}</p>}

                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    className={formik.errors.password ? "error-border" : ""}
                />
                {formik.errors.password && <p className="error">{formik.errors.password}</p>}

                {error && <p className="error" style={{ fontWeight: 'bold' }}>{error}</p>}

                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '20px' }}>
                    Login
                </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
                Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)' }}>Sign up</Link>
            </div>
        </div>
    );
}

export default Login;