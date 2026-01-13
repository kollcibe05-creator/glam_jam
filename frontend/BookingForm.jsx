import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

function BookingForm({ houseId, pricePerNight, user }) {
  const navigate = useNavigate();

  // 1. Validation Schema: Ensures check-out is after check-in
  const formSchema = yup.object().shape({
    start_date: yup.date()
      .required("Check-in date is required")
      .min(new Date(), "Check-in cannot be in the past"),
    end_date: yup.date()
      .required("Check-out date is required")
      .min(yup.ref('start_date'), "Check-out must be after check-in"),
  });

  // 2. Formik Initialization
  const formik = useFormik({
    initialValues: {
      start_date: '',
      end_date: '',
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      if (!user) {
        alert("Please login to book a house");
        return navigate("/login");
      }

      fetch("/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          house_id: houseId,
        }),
      }).then((res) => {
        if (res.ok) {
          alert("Booking request sent! Track its status in 'My Trips'.");
          navigate("/my-bookings");
        } else {
          alert("Failed to create booking. Please try again.");
        }
      });
    },
  });

  // 3. Dynamic Price Calculation
  const calculateTotal = () => {
    if (formik.values.start_date && formik.values.end_date) {
      const start = new Date(formik.values.start_date);
      const end = new Date(formik.values.end_date);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays * pricePerNight : 0;
    }
    return 0;
  };

  return (
    <div className="booking-form-container">
      <h3>${pricePerNight} <span className="text-muted">/ night</span></h3>
      <hr />
      
      <form onSubmit={formik.handleSubmit}>
        <div className="date-inputs">
          <div className="input-group">
            <label>CHECK-IN</label>
            <input
              type="date"
              name="start_date"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.start_date}
              className={formik.errors.start_date && formik.touched.start_date ? "error-input" : ""}
            />
          </div>

          <div className="input-group">
            <label>CHECK-OUT</label>
            <input
              type="date"
              name="end_date"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.end_date}
              className={formik.errors.end_date && formik.touched.end_date ? "error-input" : ""}
            />
          </div>
        </div>

        {/* Validation Errors */}
        {(formik.errors.start_date || formik.errors.end_date) && (
          <p className="error-text">
            {formik.errors.start_date || formik.errors.end_date}
          </p>
        )}

        {/* Price Breakdown */}
        {calculateTotal() > 0 && (
          <div className="price-breakdown">
            <div className="price-row">
              <span>${pricePerNight} x {calculateTotal() / pricePerNight} nights</span>
              <span>${calculateTotal()}</span>
            </div>
            <div className="price-total">
              <strong>Total</strong>
              <strong>${calculateTotal()}</strong>
            </div>
          </div>
        )}

        <button type="submit" className="btn-primary btn-block">
          Reserve House
        </button>
      </form>
      
      <p className="booking-footer">You won't be charged yet</p>
    </div>
  );
}

export default BookingForm;