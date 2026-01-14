import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchFilters from "../components/SearchFilters";

function Houses() {
  const [houses, setHouses] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(filters).toString();

    setLoading(true);
    fetch(`/houses?${query}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load houses");
        return res.json();
      })
      .then((data) => setHouses(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters]);

  function handleFilterChange(newFilters) {
    setFilters(newFilters);
  }

  if (loading) return <p>Loading houses...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <h2>Browse Homes</h2>

      <SearchFilters onFilterChange={handleFilterChange} />

      {houses.length === 0 ? (
        <p>No houses found.</p>
      ) : (
        <div className="house-grid">
          {houses.map((house) => (
            <div key={house.id} className="house-card">
              <Link to={`/houses/${house.id}`}>
                <img
                  src={house.image_url}
                  alt={house.location}
                  onError={(e) => (e.target.src = "/placeholder.jpg")}
                />

                <div className="card-info">
                  <h3>{house.location}</h3>
                  <p>⭐ {house.average_rating ?? "N/A"}</p>

                  <p>
                    {house.description
                      ? house.description.slice(0, 70) + "..."
                      : "No description"}
                  </p>

                  <p>
                    <strong>${house.price_per_night}</strong> / night
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Houses;
