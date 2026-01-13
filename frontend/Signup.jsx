import React, { useState } from 'react';

function SearchFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    location: '',
    house_type: '',
    min_rating: '',
    max_price: '' // Added price support
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Pass the clean filters object to HouseGallery
    onFilterChange(filters);
  };

  const clearFilters = () => {
    const reset = { location: '', house_type: '', min_rating: '', max_price: '' };
    setFilters(reset);
    onFilterChange(reset);
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSearch} className="filter-form">
        <div className="filter-group">
          <label>Where</label>
          <input
            name="location"
            type="text"
            placeholder="Search destinations"
            value={filters.location}
            onChange={handleChange}
          />
        </div>

        <div className="filter-group">
          <label>Property Type</label>
          <select name="house_type" value={filters.house_type} onChange={handleChange}>
            <option value="">Any Type</option>
            <option value="Villa">Villa</option>
            <option value="Apartment">Apartment</option>
            <option value="Cottage">Cottage</option>
            <option value="Penthouse">Penthouse</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Max Price</label>
          <select name="max_price" value={filters.max_price} onChange={handleChange}>
            <option value="">Any Price</option>
            <option value="100">$100 or less</option>
            <option value="250">$250 or less</option>
            <option value="500">$500 or less</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Rating</label>
          <select name="min_rating" value={filters.min_rating} onChange={handleChange}>
            <option value="">Any Rating</option>
            <option value="4.5">Top Tier (4.5+)</option>
            <option value="4">Great (4.0+)</option>
            <option value="3">Good (3.0+)</option>
          </select>
        </div>

        <div className="filter-actions">
          <button type="submit" className="search-circle-btn">
             🔍
          </button>
          {Object.values(filters).some(x => x !== '') && (
            <button type="button" className="clear-link" onClick={clearFilters}>
              Clear
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default SearchFilters;