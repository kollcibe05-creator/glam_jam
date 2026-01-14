import { useEffect, useState } from "react";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch favorites
  useEffect(() => {
    fetch("/favorites")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch favorites");
        return res.json();
      })
      .then(setFavorites)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const removeFavorite = (favId) => {
    const fav = favorites.find((f) => f.id === favId);
    if (!fav) return;

    fetch("/favorites", {
      method: "POST", // backend toggles favorite
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ house_id: fav.house_id }),
    }).then(() => {
      setFavorites((prev) => prev.filter((f) => f.id !== favId));
    });
  };

  if (loading) return <p>Loading favorites...</p>;
  if (error) return <p className="error-text">{error}</p>;

  if (!favorites.length)
    return <p className="container">Your favorites list is empty. Start exploring!</p>;

  return (
    <div className="container">
      <h2>My Favorites ❤️</h2>
      <div className="house-grid">
        {favorites.map((fav) => {
          const { house } = fav;
          return (
            <div key={fav.id} className="house-card">
              <button
                className="remove-btn"
                onClick={() => removeFavorite(fav.id)}
                title="Remove from favorites"
              >
                ❌
              </button>
              <img src={house.image_url} alt={house.location} />
              <div className="card-info">
                <h3>{house.location}</h3>
                <p>★ {house.average_rating}</p>
                <p>
                  <strong>${house.price_per_night}</strong> / night
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Favorites;
