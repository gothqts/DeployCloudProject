from flask import Flask, render_template, request, redirect, url_for
from sqlalchemy import create_engine, select, and_
from sqlalchemy.orm import sessionmaker
import random
import string

app = Flask(__name__)

# Предположим, что БД уже есть в Yandex Cloud
DATABASE_URI = "postgresql://user:password@your-yandex-cloud-host:5432/cinema_db"
engine = create_engine(DATABASE_URI)
Session = sessionmaker(bind=engine)

# Модели (как будто они уже определены в БД)
class Movie:
    def __init__(self, id, title, age_rating):
        self.id = id
        self.title = title
        self.age_rating = age_rating

class Booking:
    def __init__(self, id, movie_id, date, row, seat, confirmation_code):
        self.id = id
        self.movie_id = movie_id
        self.date = date
        self.row = row
        self.seat = seat
        self.confirmation_code = confirmation_code

# Вспомогательные функции
def get_movies():
    with Session() as session:
        movies = session.execute(select(Movie)).scalars().all()
    return movies

def get_movie_by_id(movie_id):
    with Session() as session:
        movie = session.execute(select(Movie).where(Movie.id == movie_id)).scalar_one()
    return movie

def create_booking(movie_id, date, row, seat):
    confirmation_code = ''.join(random.choices(string.digits, k=6))
    with Session() as session:
        booking = Booking(
            movie_id=movie_id,
            date=date,
            row=row,
            seat=seat,
            confirmation_code=confirmation_code
        )
        session.add(booking)
        session.commit()
    return confirmation_code

def get_booking_by_code(code):
    with Session() as session:
        booking = session.execute(select(Booking).where(Booking.confirmation_code == code)).scalar_one()
    return booking

# Роуты
@app.route("/")
def index():
    movies = get_movies()
    return render_template("index.html", movies=movies)

@app.route("/book/<int:movie_id>", methods=["GET", "POST"])
def book(movie_id):
    movie = get_movie_by_id(movie_id)
    
    if request.method == "POST":
        date = request.form.get("date")
        row = request.form.get("row")
        seat = request.form.get("seat")
        
        # Проверка занятости места (упрощенно)
        with Session() as session:
            existing = session.execute(
                select(Booking).where(
                    and_(
                        Booking.movie_id == movie_id,
                        Booking.date == date,
                        Booking.row == row,
                        Booking.seat == seat
                    )
                )
            ).scalar()
        
        if existing:
            return "Место уже занято!", 400
        
        code = create_booking(movie_id, date, row, seat)
        return redirect(url_for("confirmation", code=code))
    
    return render_template("booking.html", movie=movie)

@app.route("/confirmation/<code>")
def confirmation(code):
    booking = get_booking_by_code(code)
    movie = get_movie_by_id(booking.movie_id)
    return render_template("confirmation.html", booking=booking, movie=movie, code=code)

if __name__ == "__main__":
    app.run(debug=True)