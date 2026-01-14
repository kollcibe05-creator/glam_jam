import { useState } from "react";

function SearchFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    location: "",
    house_type: "",
    min_rating: "",
    max_price: ""
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function applyFilters(e) {
    e.preventDefault();

    // Remove empty values before sending to backend
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "")
    );

    onFilterChange(cleanedFilters);
  }

  function clearFilters() {
    setFilters({
      location: "",
      house_type: "",
      min_rating: "",
      max_price: ""
    });
    onFilterChange({});
  }

  return (
    <form className="filter-form" onSubmit={applyFilters}>
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={filters.location}
        onChange={handleChange}
      />

      <select name="house_type" value={filters.house_type} onChange={handleChange}>
        <option value="">Any type</option>
        <option value="Villa">Villa</option>
        <option value="Apartment">Apartment</option>
        <option value="Cottage">Cottage</option>
        <option value="Penthouse">Penthouse</option>
      </select>

      <select name="max_price" value={filters.max_price} onChange={handleChange}>
        <option value="">Any price</option>
        <option value="100">≤ $100</option>
        <option value="250">≤ $250</option>
        <option value="500">≤ $500</option>
      </select>

      <select name="min_rating" value={filters.min_rating} onChange={handleChange}>
        <option value="">Any rating</option>
        <option value="4.5">4.5+</option>
        <option value="4">4.0+</option>
        <option value="3">3.0+</option>
      </select>

      <button type="submit">Search</button>

      {Object.values(filters).some(Boolean) && (
        <button type="button" onClick={clearFilters}>
          Clear
        </button>
      )}
    </form>
  );
}

export default SearchFilters;
