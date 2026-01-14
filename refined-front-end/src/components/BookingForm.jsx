import { useMemo } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

function BookingForm({ houseId, pricePerNight, user }) {
  const navigate = useNavigate();

  const today = new Date();

  const schema = yup.object({
    start_date: yup
      .date()
      .required("Check-in date is required")
      .min(today, "Check-in cannot be in the past"),
    end_date: yup
      .date()
      .required("Check-out date is required")
      .min(yup.ref("start_date"), "Check-out must be after check-in"),
  });

  const formik = useFormik({
    initialValues: {
      start_date: "",
      end_date: "",
    },
    validationSchema: schema,
    onSubmit(values) {
      if (!user) return navigate("/login");

      fetch("/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, house_id: houseId }),
      }).then((res) => {
        if (res.ok) {
          navigate("/my-bookings");
        } else {
          alert("Booking failed");
        }
      });
    },
  });

  const totalPrice = useMemo(() => {
    const { start_date, end_date } = formik.values;
    if (!start_date || !end_date) return 0;

    const start = new Date(start_date);
    const end = new Date(end_date);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    return days > 0 ? days * pricePerNight : 0;
  }, [formik.values, pricePerNight]);

  return (
    <div className="booking-form-container">
      <h3>
        ${pricePerNight} <span>/ night</span>
      </h3>

      <form onSubmit={formik.handleSubmit}>
        <label>
          Check-in
          <input type="date" {...formik.getFieldProps("start_date")} />
        </label>

        <label>
          Check-out
          <input type="date" {...formik.getFieldProps("end_date")} />
        </label>

        {(formik.touched.start_date && formik.errors.start_date) ||
        (formik.touched.end_date && formik.errors.end_date) ? (
          <p className="error-text">
            {formik.errors.start_date || formik.errors.end_date}
          </p>
        ) : null}

        {totalPrice > 0 && (
          <div className="price-breakdown">
            <p>
              Total: <strong>${totalPrice}</strong>
            </p>
          </div>
        )}

        <button type="submit">Reserve</button>
      </form>

      <small>You won’t be charged yet</small>
    </div>
  );
}

export default BookingForm;
