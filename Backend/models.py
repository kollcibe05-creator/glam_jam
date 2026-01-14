from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.sql import func

from config import db, bcrypt

# ---------- ROLE ----------
class Role(db.Model, SerializerMixin):
    __tablename__ = "roles"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    users = db.relationship("User", back_populates="role")


# ---------- USER ----------
class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey("roles.id"))

    role = db.relationship("Role", back_populates="users")
    bookings = db.relationship("Booking", back_populates="user", cascade="all, delete")
    reviews = db.relationship("Review", back_populates="user", cascade="all, delete")
    favorites = db.relationship("Favorite", back_populates="user", cascade="all, delete")

    serialize_rules = ("-_password_hash", "-bookings", "-reviews", "-favorites")

    @hybrid_property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = bcrypt.generate_password_hash(
            password.encode()
        ).decode()

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode())

    @validates("email")
    def validate_email(self, key, email):
        if "@" not in email:
            raise ValueError("Invalid email")
        return email


# ---------- HOUSE ----------
class House(db.Model, SerializerMixin):
    __tablename__ = "houses"

    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String, nullable=False)
    price_per_night = db.Column(db.Integer, nullable=False)
    house_type = db.Column(db.String)
    image_url = db.Column(db.String)
    description = db.Column(db.Text)
    average_rating = db.Column(db.Float, default=0)

    bookings = db.relationship("Booking", back_populates="house", cascade="all, delete")
    reviews = db.relationship("Review", back_populates="house", cascade="all, delete")
    favorites = db.relationship("Favorite", back_populates="house", cascade="all, delete")


# ---------- BOOKING ----------
class Booking(db.Model, SerializerMixin):
    __tablename__ = "bookings"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    house_id = db.Column(db.Integer, db.ForeignKey("houses.id"))
    status = db.Column(db.String, default="Pending")
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)

    user = db.relationship("User", back_populates="bookings")
    house = db.relationship("House", back_populates="bookings")


# ---------- REVIEW ----------
class Review(db.Model, SerializerMixin):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    house_id = db.Column(db.Integer, db.ForeignKey("houses.id"))
    rating = db.Column(db.Integer)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, server_default=func.now())

    user = db.relationship("User", back_populates="reviews")
    house = db.relationship("House", back_populates="reviews")

    @validates("rating")
    def validate_rating(self, key, value):
        if not 1 <= value <= 5:
            raise ValueError("Rating must be between 1 and 5")
        return value


# ---------- FAVORITE ----------
class Favorite(db.Model, SerializerMixin):
    __tablename__ = "favorites"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    house_id = db.Column(db.Integer, db.ForeignKey("houses.id"))

    user = db.relationship("User", back_populates="favorites")
    house = db.relationship("House", back_populates="favorites")
