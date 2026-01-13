import React, { useState, useEffect } from "react";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/my-bookings")
      .then((r) => r.json())
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="container"><h3>Loading your trips...</h3></div>;

  return (
    <div className="container trip-history-page">
      <h2>My Trips & Bookings</h2>
      <div className="bookings-list">
        {bookings.length === 0 ? (
          <div className="empty-trips">
            <p>You haven't booked any trips yet!</p>
            <button className="btn-secondary" onClick={() => window.location.href='/'}>Explore Homes</button>
          </div>
        ) : (
          bookings.map((b) => (
            <div key={b.id} className="booking-card">
              <div className="booking-img-container">
                <img src={b.house?.image_url} alt={b.house?.location} />
              </div>
              <div className="booking-details">
                <div className="booking-header">
                  <h3>{b.house?.location}</h3>
                  <span className={`status-badge ${b.status.toLowerCase()}`}>
                    {b.status}
                  </span>
                </div>
                <p className="booking-type">{b.house?.house_type}</p>
                <div className="booking-dates">
                  <p><strong>Check-in:</strong> {new Date(b.start_date).toLocaleDateString()}</p>
                  <p><strong>Check-out:</strong> {new Date(b.end_date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyBookings;