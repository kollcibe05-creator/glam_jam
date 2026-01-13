import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';

function ReviewSection({ houseId, onReviewAdded }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      rating: 5,
      comment: '',
    },
    validationSchema: yup.object().shape({
      rating: yup.number().min(1).max(5).required(),
      comment: yup.string()
        .min(10, "Please share a bit more (at least 10 characters)")
        .required("A comment is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      setIsSubmitting(true);
      fetch("/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, house_id: houseId }),
      })
      .then((r) => {
        if (!r.ok) throw new Error("Submission failed");
        return r.json();
      })
      .then((newReview) => {
        resetForm();
        if (onReviewAdded) onReviewAdded(newReview);
      })
      .catch(err => alert(err.message))
      .finally(() => setIsSubmitting(false));
    },
  });

  return (
    <div className="review-form-card">
      <h4>Write a Review</h4>
      <form onSubmit={formik.handleSubmit}>
        <div className="rating-selector">
          <label>Overall Rating</label>
          <div className="star-inputs">
            {[1, 2, 3, 4, 5].map((num) => (
              <label key={num} className="star-label">
                <input
                  type="radio"
                  name="rating"
                  value={num}
                  checked={formik.values.rating === num}
                  onChange={() => formik.setFieldValue("rating", num)}
                />
                <span className={formik.values.rating >= num ? "star filled" : "star"}>★</span>
              </label>
            ))}
          </div>
        </div>

        <div className="input-group">
          <textarea
            name="comment"
            placeholder="How was your stay? Mention the host, the location, or the amenities..."
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.comment}
            className={formik.touched.comment && formik.errors.comment ? "error-border" : ""}
          />
          {formik.touched.comment && formik.errors.comment && (
            <p className="error-text">{formik.errors.comment}</p>
          )}
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={isSubmitting || !formik.isValid}
        >
          {isSubmitting ? "Posting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}

export default ReviewSection;