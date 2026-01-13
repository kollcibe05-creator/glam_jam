import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BookingForm from "./BookingForm";
import ReviewSection from "./ReviewSection";

function HouseDetail({ user }) {
  const { id } = useParams();
  const [house, setHouse] = useState(null);

  useEffect(() => {
    fetch(`/houses/${id}`)
      .then((r) => r.json())
      .then(setHouse);
  }, [id]);

  if (!house) return <div className="container">Loading...</div>;

  return (
    <div className="container house-detail-grid">
      <div className="detail-main">
        <img src={house.image_url} alt={house.location} className="detail-img" />
        <h1>{house.location}</h1>
        <p className="type-tag">{house.house_type}</p>
        <hr />
        <p className="full-description">{house.description}</p>
        <hr />
        <h3>Reviews (★ {house.average_rating})</h3>
        <div className="reviews-list">
          {house.reviews?.map(rev => (
            <div key={rev.id} className="review-item">
              <strong>{rev.user?.username}</strong>: {rev.comment} (Rating: {rev.rating}/5)
            </div>
          ))}
        </div>
        {user && <ReviewSection houseId={house.id} onReviewAdded={() => window.location.reload()} />}
      </div>
      
      <div className="detail-sidebar">
        <BookingForm houseId={house.id} pricePerNight={house.price_per_night} />
      </div>
    </div>
  );
}

export default HouseDetail;