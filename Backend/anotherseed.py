from faker import Faker
from random import randint, choice, sample
from datetime import timedelta

from config import app, db
from models import User, Role, House, Booking, Review, Favorite

fake = Faker()

def seed_data():
    with app.app_context():

        print("🔥 Clearing existing data...")
        Favorite.query.delete()
        Review.query.delete()
        Booking.query.delete()
        House.query.delete()
        User.query.delete()
        Role.query.delete()
        db.session.commit()

        # ----------------------
        # ROLES
        # ----------------------
        print("🔐 Seeding roles...")
        admin_role = Role(name="Admin")
        user_role = Role(name="User")
        db.session.add_all([admin_role, user_role])
        db.session.commit()

        # ----------------------
        # USERS
        # ----------------------
        print("👤 Seeding users...")

        admin = User(
            username="admin",
            email="admin@airbnbclone.com",
            role=admin_role
        )
        admin.password_hash = "admin123"

        users = [admin]

        for _ in range(8):
            user = User(
                username=fake.unique.user_name(),
                email=fake.unique.email(),
                role=user_role
            )
            user.password_hash = "password123"
            users.append(user)

        db.session.add_all(users)
        db.session.commit()

        # ----------------------
        # HOUSES
        # ----------------------
        print("🏠 Seeding houses...")

        house_types = ["Villa", "Apartment", "Cottage", "Beach House", "Studio"]

        houses = []
        for _ in range(12):
            house = House(
                location=f"{fake.city()}, Kenya",
                price_per_night=randint(50, 300),
                house_type=choice(house_types),
                image_url=fake.image_url(),
                description=fake.paragraph(nb_sentences=4),
                average_rating=0.0
            )
            houses.append(house)

        db.session.add_all(houses)
        db.session.commit()

        # ----------------------
        # BOOKINGS
        # ----------------------
        print("📅 Seeding bookings...")

        statuses = ["Pending", "Approved", "Cancelled"]

        bookings = []
        for _ in range(15):
            start_date = fake.date_time_between(start_date="-30d", end_date="now")
            booking = Booking(
                user=choice(users[1:]),
                house=choice(houses),
                start_date=start_date,
                end_date=start_date + timedelta(days=randint(2, 7)),
                status=choice(statuses)
            )
            bookings.append(booking)

        db.session.add_all(bookings)
        db.session.commit()

        # ----------------------
        # REVIEWS
        # ----------------------
        print("⭐ Seeding reviews...")

        reviews = []
        for house in houses:
            house_reviews = sample(users[1:], randint(1, 4))
            ratings = []

            for user in house_reviews:
                rating = randint(1, 5)
                review = Review(
                    user=user,
                    house=house,
                    rating=rating,
                    comment=fake.sentence()
                )
                reviews.append(review)
                ratings.append(rating)

            house.average_rating = round(sum(ratings) / len(ratings), 1)

        db.session.add_all(reviews)
        db.session.commit()

        # ----------------------
        # FAVORITES
        # ----------------------
        print("❤️ Seeding favorites...")

        favorites = []
        for user in users[1:]:
            fav_houses = sample(houses, randint(1, 3))
            for house in fav_houses:
                favorites.append(Favorite(user=user, house=house))

        db.session.add_all(favorites)
        db.session.commit()

        print("✅ Database seeded successfully with Faker!")

if __name__ == "__main__":
    seed_data()
