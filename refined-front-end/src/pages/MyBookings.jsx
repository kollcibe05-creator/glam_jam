// src/pages/MyBookings.jsx
import React, { useState, useEffect } from "react";

function MyBookings({ user }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (user) {
      fetch("/bookings")
        .then((r) => r.json())
        .then((data) => {
          // Optionally filter for the current user if backend returns all
          setBookings(data.filter(b => b.user_id === user.id));
        });
    }
  }, [user]);

  if (!user) return <div className="container"><p>Please log in to view your bookings.</p></div>;

  return (
    <div className="container">
      <h2>My Trips 🏡</h2>
      {bookings.length === 0 ? (
        <p>You have no bookings yet. Start exploring!</p>
      ) : (
        <div className="house-grid">
          {bookings.map((b) => (
            <div key={b.id} className="house-card">
              <img src={b.house?.image_url} alt={b.house?.location} />
              <div className="card-info">
                <h3>{b.house?.location}</h3>
                <p>Status: <strong>{b.status}</strong></p>
                <p>
                  {b.start_date} → {b.end_date}
                </p>
                <p><strong>${b.house?.price_per_night}</strong> / night</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
