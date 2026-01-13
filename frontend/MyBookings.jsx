import React, { useState, useEffect } from "react";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("/my-bookings")
      .then((r) => r.json())
      .then(setBookings);
  }, []);

  return (
    <div className="container">
      <h2>My Trips & Bookings</h2>
      <div className="bookings-list">
        {bookings.length === 0 ? (
          <p>You haven't booked any trips yet!</p>
        ) : (
          bookings.map((b) => (
            <div key={b.id} className="booking-card" style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center' }}>
              <img src={b.house?.image_url} alt={b.house?.location} style={{ width: '150px', borderRadius: '8px' }} />
              <div>
                <h3>{b.house?.location}</h3>
                <p><strong>Dates:</strong> {new Date(b.start_date).toLocaleDateString()} - {new Date(b.end_date).toLocaleDateString()}</p>
                <p>
                    Status: <span className={`status-badge ${b.status.toLowerCase()}`}>{b.status}</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyBookings;