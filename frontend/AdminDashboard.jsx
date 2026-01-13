import React, { useState, useEffect } from "react";

function AdminDashboard({ user }) {
  const [data, setData] = useState({ bookings: [], users: [], houses: [] });
  const [editingHouse, setEditingHouse] = useState(null);
  const [newHouse, setNewHouse] = useState({
    location: "", house_type: "", price_per_night: "", image_url: "", description: ""
  });

  useEffect(() => {
    if (user?.role?.name === "Admin") {
      fetchData();
    }
  }, [user]);

  const fetchData = () => {
    Promise.all([
      fetch("/bookings").then(r => r.json()),
      fetch("/users").then(r => r.json()),
      fetch("/houses").then(r => r.json())
    ]).then(([bookings, users, houses]) => setData({ bookings, users, houses }));
  };

  // --- BOOKING APPROVAL ---
  const updateBooking = (id) => {
    fetch(`/bookings/${id}/approve`, { method: "PATCH" })
      .then(r => {
        if (r.ok) {
          setData(prev => ({
            ...prev,
            bookings: prev.bookings.map(b => b.id === id ? { ...b, status: "Approved" } : b)
          }));
        }
      });
  };

  // --- HOUSE CRUD: DELETE ---
  const deleteHouse = (id) => {
    fetch(`/houses/${id}`, { method: "DELETE" })
      .then(() => {
        setData(prev => ({ ...prev, houses: prev.houses.filter(h => h.id !== id) }));
      });
  };

  // --- HOUSE CRUD: CREATE/UPDATE ---
  const handleHouseSubmit = (e) => {
    e.preventDefault();
    const method = editingHouse ? "PATCH" : "POST";
    const url = editingHouse ? `/houses/${editingHouse.id}` : "/houses";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newHouse)
    })
    .then(r => r.json())
    .then(() => {
      fetchData(); // Refresh list
      setEditingHouse(null);
      setNewHouse({ location: "", house_type: "", price_per_night: "", image_url: "", description: "" });
    });
  };

  if (user?.role?.name !== "Admin") return <div className="container"><h1>Access Denied</h1></div>;

  return (
    <div className="container">
      <h1>Admin Control Panel</h1>

      <div className="admin-grid">
        {/* SECTION 1: BOOKING APPROVALS */}
        <section className="admin-section">
          <h2>Manage Bookings</h2>
          <div className="admin-scroll-box">
            {data.bookings.map(b => (
              <div key={b.id} className="admin-card">
                <p><strong>{b.user?.username}</strong> → House #{b.house_id}</p>
                <p>Status: <span className={`status-${b.status.toLowerCase()}`}>{b.status}</span></p>
                {b.status !== "Approved" && (
                  <button onClick={() => updateBooking(b.id)}>Approve Request</button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: USER REGISTRY */}
        <section className="admin-section">
          <h2>User Credentials Registry</h2>
          <table className="user-table">
            <thead>
              <tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th></tr>
            </thead>
            <tbody>
              {data.users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td><td>{u.username}</td><td>{u.email}</td><td>{u.role?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* SECTION 3: HOUSE CRUD */}
        <section className="admin-section full-width">
          <h2>Manage House Listings (CRUD)</h2>
          
          <form onSubmit={handleHouseSubmit} className="admin-form">
            <h3>{editingHouse ? "Edit House" : "Add New House"}</h3>
            <div className="form-row">
              <input placeholder="Location" value={newHouse.location} onChange={e => setNewHouse({...newHouse, location: e.target.value})} required />
              <input placeholder="Type (Villa/Apt)" value={newHouse.house_type} onChange={e => setNewHouse({...newHouse, house_type: e.target.value})} />
              <input type="number" placeholder="Price" value={newHouse.price_per_night} onChange={e => setNewHouse({...newHouse, price_per_night: e.target.value})} required />
            </div>
            <input placeholder="Image URL" value={newHouse.image_url} onChange={e => setNewHouse({...newHouse, image_url: e.target.value})} />
            <textarea placeholder="Description" value={newHouse.description} onChange={e => setNewHouse({...newHouse, description: e.target.value})} />
            <button type="submit">{editingHouse ? "Update Listing" : "Create Listing"}</button>
            {editingHouse && <button type="button" onClick={() => setEditingHouse(null)}>Cancel</button>}
          </form>

          <div className="house-admin-list">
            {data.houses.map(h => (
              <div key={h.id} className="admin-house-item">
                <span>{h.location} (${h.price_per_night})</span>
                <div>
                  <button onClick={() => { setEditingHouse(h); setNewHouse(h); }}>Edit</button>
                  <button className="btn-delete" onClick={() => deleteHouse(h.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;