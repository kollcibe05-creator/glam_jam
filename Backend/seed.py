from config import app, db, bcrypt
from models import User, Role, House, Review, Booking
import datetime

with app.app_context():
    print("Deleting existing data...")
    Booking.query.delete()
    Review.query.delete()
    House.query.delete()
    User.query.delete()
    Role.query.delete()

    print("Creating roles...")
    admin_role = Role(name="Admin")
    user_role = Role(name="User")
    db.session.add_all([admin_role, user_role])
    db.session.commit()

    print("Creating users...")
    admin = User(username="admin", email="admin@glamjam.com", role=admin_role)
    admin.password_hash = "admin123"
    
    test_user = User(username="traveler1", email="user@glamjam.com", role=user_role)
    test_user.password_hash = "pass123"
    db.session.add_all([admin, test_user])

    print("Creating houses...")
    houses = [
        House(location="Nairobi, Kenya", price_per_night=150, house_type="Villa", 
              image_url="https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
              description="Modern luxury villa with a view of the skyline.", average_rating=4.8),
        House(location="Diani, Kenya", price_per_night=250, house_type="Beach House", 
              image_url="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2",
              description="Direct access to white sandy beaches.", average_rating=5.0),
        House(location="Naivasha, Kenya", price_per_night=120, house_type="Cottage", 
              image_url="https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
              description="Cozy cottage perfect for weekend getaways.", average_rating=4.2),
    ]
    db.session.add_all(houses)
    db.session.commit()

    print("Seeding complete! 🚀")