import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

function Login({ setUser }) {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: yup.object().shape({
            username: yup.string().required("Username is required"),
            password: yup.string().required("Password is required"),
        }),
        onSubmit: (values) => {
            fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            }).then((res) => {
                if (res.ok) {
                    res.json().then((user) => {
                        setUser(user);
                        navigate("/");
                    });
                } else {
                    alert("Invalid username or password");
                }
            });
        },
    });

    return (
        <div className="form-box">
            <h2>Login</h2>
            <form onSubmit={formik.handleSubmit}>
                <input
                    name="username"
                    placeholder="Username"
                    onChange={formik.handleChange}
                    value={formik.values.username}
                />
                <p className="error">{formik.errors.username}</p>

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                />
                <p className="error">{formik.errors.password}</p>

                <button type="submit" className="btn-primary">Sign In</button>
            </form>
        </div>
    );
}

export default Login;