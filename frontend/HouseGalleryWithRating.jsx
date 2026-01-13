// frontend/src/components/HouseGalleryWithRating.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchFilters from './SearchFilters'; // Import the new component

function HouseGalleryWithRating() {
  const [houses, setHouses] = useState([]);
  const [filters, setFilters] = useState({}); // State to hold search filters

  useEffect(() => {
    // Construct query string from filters
    const queryString = new URLSearchParams(filters).toString();
    fetch(`/houses?${queryString}`)
      .then((r) => r.json())
      .then((data) => setHouses(data));
  }, [filters]); // Re-fetch when filters change

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="container">
      <h2>Browse Homes</h2>
      <SearchFilters onFilterChange={handleFilterChange} /> {/* Integrate search filters */}
      <div className="house-grid">
        {houses.map((house) => (
          <div key={house.id} className="house-card">
            <Link to={`/houses/${house.id}`}>
              <img src={house.image_url} alt={house.location} />
              <div className="badge">{house.house_type}</div>
              <div className="card-info">
                <div className="card-header">
                  <h3>{house.location}</h3>
                  <span>⭐ {house.average_rating}</span>
                </div>
                <p className="description">{house.description.substring(0, 70)}...</p>
                <p className="price"><strong>${house.price_per_night}</strong> / night</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HouseGalleryWithRating;