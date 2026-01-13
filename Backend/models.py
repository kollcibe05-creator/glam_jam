from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from config import db, bcrypt  # Assuming db and bcrypt are initialized in config.py

# MetaData for naming conventions (good practice for migrations)
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

class Role(db.Model, SerializerMixin):
    __tablename__ = 'roles'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    # Relationship
    users = db.relationship('User', back_populates='role')
    
    # Serialization rules
    serialize_rules = ('-users.role',)

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))

    # Relationships
    role = db.relationship('Role', back_populates='users')
    bookings = db.relationship('Booking', back_populates='user', cascade='all, delete-orphan')
    reviews = db.relationship('Review', back_populates='user', cascade='all, delete-orphan')
    favorites = db.relationship('Favorite', back_populates='user', cascade='all, delete-orphan')

    # Serialization rules: Exclude password and prevent recursion
    serialize_rules = ('-_password_hash', '-bookings.user', '-reviews.user', '-favorites.user', '-role.users')

    # Bcrypt Password logic
    @hybrid_property
    def password_hash(self):
        return self._password_hash

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    # Validation
    @validates('email')
    def validate_email(self, key, address):
        if '@' not in address:
            raise ValueError("Failed email validation: Address must contain @")
        return address

class House(db.Model, SerializerMixin):
    __tablename__ = 'houses'

    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String, nullable=False)
    price_per_night = db.Column(db.Integer, nullable=False)
    house_type = db.Column(db.String)
    image_url = db.Column(db.String)
    description = db.Column(db.Text)

    # Relationships
    average_rating = db.Column(db.Float, default=0.0)

    bookings = db.relationship('Booking', back_populates='house', cascade='all, delete-orphan')
    reviews = db.relationship('Review', back_populates='house', cascade='all, delete-orphan')
    favorites = db.relationship('Favorite', back_populates='house', cascade='all, delete-orphan')

    serialize_rules = ('-bookings.house', '-reviews.house', '-favorites.house')

class Booking(db.Model, SerializerMixin):
    __tablename__ = 'bookings'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    house_id = db.Column(db.Integer, db.ForeignKey('houses.id'))
    status = db.Column(db.String, default='Pending') # Pending, Approved, Denied
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)

    # Relationships
    user = db.relationship('User', back_populates='bookings')
    house = db.relationship('House', back_populates='bookings')

    serialize_rules = ('-user.bookings', '-house.bookings')

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    house_id = db.Column(db.Integer, db.ForeignKey('houses.id'))
    rating = db.Column(db.Integer)
    comment = db.Column(db.Text)

    # Relationships
    user = db.relationship('User', back_populates='reviews')
    house = db.relationship('House', back_populates='reviews')

    serialize_rules = ('-user.reviews', '-house.reviews')

    @validates('rating')
    def validate_rating(self, key, value):
        if not (1 <= value <= 5):
            raise ValueError("Rating must be between 1 and 5")
        return value

class Favorite(db.Model, SerializerMixin):
    __tablename__ = 'favorites'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    house_id = db.Column(db.Integer, db.ForeignKey('houses.id'))

    # Relationships
    user = db.relationship('User', back_populates='favorites')
    house = db.relationship('House', back_populates='favorites')

    serialize_rules = ('-user.favorites', '-house.favorites')