import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BookingForm from "./BookingForm";
import ReviewSection from "./ReviewSection";

function HouseDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [house, setHouse] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // 1. Fetch House Data on Load
  useEffect(() => {
    fetch(`/houses/${id}`)
      .then((r) => {
        if (r.ok) return r.json();
        throw new Error("House not found");
      })
      .then((data) => {
        setHouse(data);
        // Check if this house is in user's favorites
        if (user && data.favorited_by) {
            setIsFavorite(data.favorited_by.some(f => f.user_id === user.id));
        }
      })
      .catch(() => navigate("/"));
  }, [id, user, navigate]);

  // 2. Toggle Favorite Status
  const toggleFavorite = () => {
    if (!user) return navigate("/login");

    fetch("/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ house_id: house.id }),
    }).then((r) => {
      if (r.ok) setIsFavorite(!isFavorite);
    });
  };

  if (!house) return <div className="loading">Loading property details...</div>;

  return (
    <div className="container house-detail-page">
      {/* Header Section */}
      <div className="detail-header">
        <h1>{house.location}</h1>
        <div className="header-actions">
          <button className={`fav-btn ${isFavorite ? "active" : ""}`} onClick={toggleFavorite}>
            {isFavorite ? "❤️ Saved" : "🤍 Save"}
          </button>
        </div>
      </div>

      <div className="house-detail-grid">
        {/* Main Content: Images, Description, Reviews */}
        <div className="detail-main">
          <div className="image-gallery">
            <img src={house.image_url} alt={house.location} className="main-img" />
          </div>

          <div className="host-info">
            <h2>{house.house_type} in {house.location}</h2>
            <p className="rating-summary">★ {house.average_rating || "New"} · {house.reviews?.length || 0} reviews</p>
          </div>

          <hr />

          <div className="description-box">
            <h3>About this space</h3>
            <p>{house.description}</p>
          </div>

          <hr />

          {/* Review Section */}
          <div className="reviews-container">
            <h3>User Reviews</h3>
            {house.reviews?.length > 0 ? (
              house.reviews.map((rev) => (
                <div key={rev.id} className="review-card">
                  <div className="review-header">
                    <strong>{rev.user?.username}</strong>
                    <span className="review-stars">{"★".repeat(rev.rating)}</span>
                  </div>
                  <p>{rev.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-muted">No reviews yet. Be the first to stay here!</p>
            )}
            
            {user && (
              <ReviewSection 
                houseId={house.id} 
                onReviewAdded={() => {
                  // Re-fetch data to show new review without reload
                  fetch(`/houses/${id}`).then(r => r.json()).then(setHouse);
                }} 
              />
            )}
          </div>
        </div>

        {/* Sidebar: Sticky Booking Form */}
        <div className="detail-sidebar">
          <BookingForm 
            houseId={house.id} 
            pricePerNight={house.price_per_night} 
            user={user} 
          />
        </div>
      </div>
    </div>
  );
}

export default HouseDetail;