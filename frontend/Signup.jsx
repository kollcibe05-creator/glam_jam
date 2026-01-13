import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

function SignupForm({ setUser }) {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: { username: '', email: '', password: '' },
        validationSchema: yup.object().shape({
            username: yup.string().required().min(3),
            email: yup.string().email().required(),
            password: yup.string().required().min(6),
        }),
        onSubmit: (values) => {
            fetch("/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            }).then((res) => {
                if (res.ok) {
                    res.json().then((user) => {
                        setUser(user);
                        navigate("/");
                    });
                }
            });
        },
    });

    return (
        <div className="form-box">
            <h2>Create Account</h2>
            <form onSubmit={formik.handleSubmit}>
                <input name="username" placeholder="Username" onChange={formik.handleChange} value={formik.values.username} />
                <input name="email" placeholder="Email" onChange={formik.handleChange} value={formik.values.email} />
                <input name="password" type="password" placeholder="Password" onChange={formik.handleChange} value={formik.values.password} />
                <button type="submit" className="btn-primary">Sign Up</button>
            </form>
        </div>
    );
}

export default SignupForm;