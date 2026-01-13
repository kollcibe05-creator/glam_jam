function Favorites() {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        fetch("/favorites")
            .then((r) => r.json())
            .then(setFavorites);
    }, []);

    const removeFavorite = (favId) => {
        // We use the house_id logic from your backend resource
        const favToRemove = favorites.find(f => f.id === favId);
        fetch("/favorites", {
            method: "POST", // Your backend uses POST to toggle
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ house_id: favToRemove.house_id })
        }).then(() => {
            setFavorites(favorites.filter(f => f.id !== favId));
        });
    };

    return (
        <div className="container">
            <h2>My Favorites ❤️</h2>
            {favorites.length === 0 ? (
                <p>Your list is empty. Start exploring!</p>
            ) : (
                <div className="house-grid">
                    {favorites.map((fav) => (
                        <div key={fav.id} className="house-card">
                            <button 
                                className="remove-btn" 
                                onClick={() => removeFavorite(fav.id)}
                                style={{ position: 'absolute', right: '10px', top: '10px', zIndex: 1 }}
                            >
                                ❌
                            </button>
                            <img src={fav.house.image_url} alt={fav.house.location} />
                            <div className="card-info">
                                <h3>{fav.house.location}</h3>
                                <p>★ {fav.house.average_rating}</p>
                                <p><strong>${fav.house.price_per_night}</strong> / night</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}