import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import BookingForm from "../components/BookingForm";
import ReviewSection from "../components/ReviewSection";

function HouseDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [house, setHouse] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchHouse = useCallback(() => {
    setLoading(true);
    fetch(`/houses/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("House not found");
        return res.json();
      })
      .then((data) => {
        setHouse(data);
        if (user && data.favorited_by) {
          setIsFavorite(data.favorited_by.some((f) => f.user_id === user.id));
        }
      })
      .catch(() => navigate("/houses"))
      .finally(() => setLoading(false));
  }, [id, user, navigate]);

  useEffect(() => {
    fetchHouse();
  }, [fetchHouse]);

  function toggleFavorite() {
    if (!user) return navigate("/login");

    fetch("/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ house_id: house.id }),
    }).then((res) => {
      if (res.ok) setIsFavorite((prev) => !prev);
    });
  }

  if (loading) return <p>Loading property...</p>;
  if (!house) return null;

  return (
    <div className="container house-detail-page">
      <header className="detail-header">
        <h1>{house.location}</h1>
        <button
          className={`fav-btn ${isFavorite ? "active" : ""}`}
          onClick={toggleFavorite}
        >
          {isFavorite ? "❤️ Saved" : "🤍 Save"}
        </button>
      </header>

      <div className="house-detail-grid">
        {/* MAIN */}
        <div>
          <img
            src={house.image_url}
            alt={house.location}
            onError={(e) => (e.target.src = "/placeholder.jpg")}
          />

          <h2>
            {house.house_type} in {house.location}
          </h2>

          <p>
            ★ {house.average_rating ?? "New"} ·{" "}
            {house.reviews?.length ?? 0} reviews
          </p>

          <section>
            <h3>About this place</h3>
            <p>{house.description || "No description provided."}</p>
          </section>

          <section>
            <h3>Reviews</h3>

            {house.reviews?.length ? (
              house.reviews.map((rev) => (
                <div key={rev.id}>
                  <strong>{rev.user?.username}</strong>
                  <span>{"★".repeat(rev.rating)}</span>
                  <p>{rev.comment}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}

            {user && (
              <ReviewSection houseId={house.id} onReviewAdded={fetchHouse} />
            )}
          </section>
        </div>

        {/* SIDEBAR */}
        <aside>
          <BookingForm
            houseId={house.id}
            pricePerNight={house.price_per_night}
            user={user}
          />
        </aside>
      </div>
    </div>
  );
}

export default HouseDetail;
