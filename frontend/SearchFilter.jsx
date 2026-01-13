// frontend/src/components/SearchFilters.jsx
import React, { useState } from 'react';

function SearchFilters({ onFilterChange }) {
  const [location, setLocation] = useState('');
  const [houseType, setHouseType] = useState('');
  const [minRating, setMinRating] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onFilterChange({ location, type: houseType, rating: minRating });
  };

  return (
    <div className="filter-section">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <select
          value={houseType}
          onChange={(e) => setHouseType(e.target.value)}
        >
          <option value="">Any Type</option>
          <option value="Villa">Villa</option>
          <option value="Apartment">Apartment</option>
          <option value="Cottage">Cottage</option>
          {/* Add more types as needed */}
        </select>
        <select
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        >
          <option value="">Any Rating</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
          <option value="2">2+ Stars</option>
        </select>
        <button type="submit" className="btn-primary">Search</button>
      </form>
    </div>
  );
}

export default SearchFilters;