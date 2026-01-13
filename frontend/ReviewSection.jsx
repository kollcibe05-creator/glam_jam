import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';

function ReviewSection({ houseId, onReviewAdded }) {
    const formik = useFormik({
        initialValues: {
            rating: 5,
            comment: '',
        },
        validationSchema: yup.object().shape({
            rating: yup.number().min(1).max(5).required(),
            comment: yup.string().min(10, "Comment must be at least 10 characters").required(),
        }),
        onSubmit: (values, { resetForm }) => {
            fetch("/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...values, house_id: houseId }),
            })
            .then((r) => r.json())
            .then((newReview) => {
                alert("Review submitted!");
                resetForm();
                if (onReviewAdded) onReviewAdded(newReview);
            });
        },
    });

    return (
        <div className="review-section">
            <h4>Leave a Review</h4>
            <form onSubmit={formik.handleSubmit}>
                <label>Rating:</label>
                <select name="rating" onChange={formik.handleChange} value={formik.values.rating}>
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                </select>

                <textarea
                    name="comment"
                    placeholder="Tell us about your stay..."
                    onChange={formik.handleChange}
                    value={formik.values.comment}
                />
                <p className="error">{formik.errors.comment}</p>

                <button type="submit" className="btn-primary">Post Review</button>
            </form>
        </div>
    );
}

export default ReviewSection;