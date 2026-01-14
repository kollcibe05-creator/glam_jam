from flask import request, session
from flask_restful import Resource
from functools import wraps

from config import app, api, db
from models import User, Role, House, Booking, Review, Favorite

# ======================================================
# ADMIN DECORATOR
# ======================================================
def admin_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        user = User.query.get(session.get("user_id"))
        if not user or not user.role or user.role.name != "Admin":
            return {"error": "Admin access required"}, 403
        return f(*args, **kwargs)
    return wrapper


# ======================================================
# AUTH RESOURCES
# ======================================================
class Signup(Resource):
    def post(self):
        data = request.get_json()
        role = Role.query.filter_by(name="User").first()

        user = User(
            username=data["username"],
            email=data["email"],
            role=role
        )
        user.password_hash = data["password"]

        db.session.add(user)
        db.session.commit()

        session.clear()
        session["user_id"] = user.id
        return user.to_dict(), 201


class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data["username"]).first()

        if user and user.authenticate(data["password"]):
            session.clear()
            session["user_id"] = user.id
            return user.to_dict(), 200

        return {"error": "Invalid credentials"}, 401


class Logout(Resource):
    def delete(self):
        session.clear()
        return {}, 204


class CheckSession(Resource):
    def get(self):
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "Not logged in"}, 401

        return User.query.get(user_id).to_dict(), 200


# ======================================================
# HOUSE RESOURCES
# ======================================================
class Houses(Resource):
    def get(self):
        location = request.args.get("location")
        house_type = request.args.get("type")
        rating = request.args.get("rating")

        query = House.query

        if location:
            query = query.filter(House.location.ilike(f"%{location}%"))
        if house_type:
            query = query.filter_by(house_type=house_type)

        houses = query.all()

        if rating:
            houses = [h for h in houses if h.average_rating >= float(rating)]

        return [h.to_dict() for h in houses], 200

    @admin_required
    def post(self):
        data = request.get_json()
        house = House(**data)
        db.session.add(house)
        db.session.commit()
        return house.to_dict(), 201


# ======================================================
# BOOKING RESOURCES
# ======================================================
class Bookings(Resource):
    def post(self):
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "Unauthorized"}, 401

        data = request.get_json()

        user = User.query.get(user_id)
        house = House.query.get(data["house_id"])

        if not house:
            return {"error": "House not found"}, 404

        booking = Booking(
            user=user,
            house=house,
            start_date=data["start_date"],
            end_date=data["end_date"]
        )

        db.session.add(booking)
        db.session.commit()
        return booking.to_dict(), 201


class ApproveBooking(Resource):
    @admin_required
    def patch(self, id):
        booking = Booking.query.get_or_404(id)
        booking.status = "Approved"
        db.session.commit()
        return booking.to_dict(), 200


# ======================================================
# REVIEW & FAVORITE RESOURCES
# ======================================================
class Reviews(Resource):
    def post(self):
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "Unauthorized"}, 401

        data = request.get_json()

        house = House.query.get(data["house_id"])
        if not house:
            return {"error": "House not found"}, 404

        review = Review(
            user=User.query.get(user_id),
            house=house,
            rating=data["rating"],
            comment=data["comment"]
        )

        db.session.add(review)
        db.session.commit()

        ratings = [r.rating for r in house.reviews]
        house.average_rating = round(sum(ratings) / len(ratings), 1)
        db.session.commit()

        return review.to_dict(), 201


class Favorites(Resource):
    def post(self):
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "Unauthorized"}, 401

        data = request.get_json()

        fav = Favorite.query.filter_by(
            user_id=user_id,
            house_id=data["house_id"]
        ).first()

        if fav:
            db.session.delete(fav)
            db.session.commit()
            return {"message": "Removed from favorites"}, 200

        fav = Favorite(
            user_id=user_id,
            house_id=data["house_id"]
        )
        db.session.add(fav)
        db.session.commit()
        return fav.to_dict(), 201


# ======================================================
# ROUTE REGISTRATION
# ======================================================
api.add_resource(Signup, "/signup")
api.add_resource(Login, "/login")
api.add_resource(Logout, "/logout")
api.add_resource(CheckSession, "/check_session")

api.add_resource(Houses, "/houses")
api.add_resource(Bookings, "/bookings")
api.add_resource(ApproveBooking, "/bookings/<int:id>/approve")
api.add_resource(Reviews, "/reviews")
api.add_resource(Favorites, "/favorites")


if __name__ == "__main__":
    app.run(port=5555, debug=True)
