from flask import request, session, make_response
from flask_restful import Resource
from config import app, db, api
from models import User, House, Booking, Review, Favorite
from functools import wraps

# --- ADMIN DECORATOR ---
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = User.query.get(session.get('user_id'))
        if not user or user.role.name != 'Admin':
            return {"error": "Unauthorized. Admin access required."}, 403
        return f(*args, **kwargs)
    return decorated_function

# --- AUTHENTICATION ---
class Signup(Resource):
    def post(self):
        data = request.get_json()
        try:
            new_user = User(
                username=data.get('username'),
                email=data.get('email'),
                role_id=2 # Default to 'User'
            )
            new_user.password_hash = data.get('password')
            db.session.add(new_user)
            db.session.commit()
            session['user_id'] = new_user.id
            return new_user.to_dict(), 201
        except Exception as e:
            return {"errors": [str(e)]}, 422

class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data.get('username')).first()
        if user and user.authenticate(data.get('password')):
            session['user_id'] = user.id
            return user.to_dict(), 200
        return {"error": "Invalid username or password"}, 401

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return {}, 204

# --- HOUSES (Search & Admin Post) ---
class HouseList(Resource):
    def get(self):
        # Requirements: Search by location, type, and rating
        location = request.args.get('location')
        type_query = request.args.get('type')
        min_rating = request.args.get('rating')
        
        query = House.query
        
        if location:
            query = query.filter(House.location.icontains(location))
        if type_query:
            query = query.filter(House.house_type == type_query)
            
        all_houses = query.all()
        
        # Requirement: Search by rating
        if min_rating:
            all_houses = [h for h in all_houses if h.average_rating >= float(min_rating)]
            
        return [h.to_dict(rules=('-bookings', '-reviews')) for h in all_houses], 200

    @admin_required
    def post(self):
        # Admin Requirement: CRUD (Create)
        data = request.get_json()
        new_house = House(
            location=data['location'],
            price_per_night=data['price_per_night'],
            house_type=data['house_type'],
            image_url=data['image_url'],
            description=data['description'],
            average_rating=0.0
        )
        db.session.add(new_house)
        db.session.commit()
        return new_house.to_dict(), 201

# --- HOUSE CRUD (Admin Update/Delete) ---
class HouseByID(Resource):
    @admin_required
    def patch(self, id):
        # Admin Requirement: CRUD (Update)
        house = House.query.get_or_404(id)
        data = request.get_json()
        for attr in data:
            setattr(house, attr, data[attr])
        db.session.commit()
        return house.to_dict(), 200

    @admin_required
    def delete(self, id):
        # Admin Requirement: CRUD (Delete)
        house = House.query.get_or_404(id)
        db.session.delete(house)
        db.session.commit()
        return {}, 204

# --- BOOKINGS ---
class BookingList(Resource):
    @admin_required
    def post(self):
    # User Requirement: Rent a house
    user_id = session.get('user_id')
        if not user_id:
            return {"error": "Must be logged in"}, 401
            
        data = request.get_json()
        booking = Booking(
            user_id=user_id,
            house_id=data['house_id'],
            start_date=data['start_date'],
            end_date=data['end_date'],
            status="Pending"
        )
        db.session.add(booking)
        db.session.commit()
        return booking.to_dict(), 201    
    def get(self):
        all_bookings = Booking.query.all()
        return [b.to_dict() for b in all_bookings], 200
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Must be logged in"}, 401
            
        data = request.get_json()
        booking = Booking(
            user_id=user_id,
            house_id=data['house_id'],
            start_date=data['start_date'],
            end_date=data['end_date'],
            status="Pending"
        )
        db.session.add(booking)
        db.session.commit()
        return booking.to_dict(), 201

class ApproveBooking(Resource):
    @admin_required
    def patch(self, id):
        # Admin Requirement: Approve house renting
        booking = Booking.query.get_or_404(id)
        booking.status = "Approved"
        db.session.commit()
        return booking.to_dict(), 200

# --- FAVORITES ---
class FavoriteResource(Resource):
    def post(self):
        user_id = session.get('user_id')
        if not user_id: return {"error": "Unauthorized"}, 401
        
        data = request.get_json()
        exists = Favorite.query.filter_by(user_id=user_id, house_id=data['house_id']).first()
        
        if exists:
            db.session.delete(exists)
            db.session.commit()
            return {"message": "Removed from favorites"}, 200
        
        new_fav = Favorite(user_id=user_id, house_id=data['house_id'])
        db.session.add(new_fav)
        db.session.commit()
        return new_fav.to_dict(), 201

class ReviewResource(Resource):
    def post(self):
        user_id = session.get('user_id')
        if not user_id: return {"error": "Unauthorized"}, 401
        
        data = request.get_json()
        new_review = Review(
            user_id=user_id,
            house_id=data['house_id'],
            rating=data['rating'],
            comment=data['comment']
        )
        db.session.add(new_review)
        db.session.commit()
        
        # Logic to update House average rating could go here
        return new_review.to_dict(), 201
class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = User.query.get(user_id)
            return user.to_dict(), 200
        return {"error": "Not logged in"}, 401

# Add this to app.py to let users see their own trips
class UserBookings(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return {"error": "Unauthorized"}, 401
        
        user = User.query.get(user_id)
        # Returns all bookings for the logged-in user
        return [b.to_dict() for b in user.bookings], 200
# In app.py, define this resource:
class UserList(Resource):
    @admin_required
    def get(self):
        users = User.query.all()
        return [u.to_dict() for u in users], 200

# And register it with the API:
api.add_resource(UserList, '/users')
api.add_resource(UserBookings, '/my-bookings')
api.add_resource(CheckSession, '/check_session')        
# --- REGISTRATION ---
api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(HouseList, '/houses')
api.add_resource(HouseByID, '/houses/<int:id>')
api.add_resource(BookingList, '/bookings')
api.add_resource(ApproveBooking, '/bookings/<int:id>/approve')
api.add_resource(FavoriteResource, '/favorites')
api.add_resource(ReviewResource, '/reviews')

if __name__ == '__main__':
    app.run(port=5555, debug=True)