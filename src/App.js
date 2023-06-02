














import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const App = () => {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    axios
      .get('https://api.tvmaze.com/search/shows?q=all')
      .then(response => {
        const showsData = response.data.map(show => {
          const randomRating = Math.floor(Math.random() * 10) + 1;

          return {
            ...show,
            rating: {
              average: randomRating
            }
          };
        });

        setShows(showsData);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const ShowDetails = () => {
    const { id } = useParams();
    const [show, setShow] = useState(null);
    const showDetailsRef = useRef(null);
    const [bookingDetails, setBookingDetails] = useState({
      name: '',
      email: '',
      ticketQuantity: 1
    });

    useEffect(() => {
      axios
        .get(`https://api.tvmaze.com/shows/${id}`)
        .then(response => {
          setShow(response.data);

          if (showDetailsRef.current) {
            showDetailsRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        })
        .catch(error => {
          console.error(error);
        });
    }, [id]);

    const handleBooking = (event) => {
      event.preventDefault();
      const { name, email, ticketQuantity } = bookingDetails;

      console.log('Booking details:', { name, email, ticketQuantity });

      setBookingDetails({
        name: '',
        email: '',
        ticketQuantity: 1
      });
    };

    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setBookingDetails(prevState => ({
        ...prevState,
        [name]: value
      }));
    };

    if (!show) {
      return <div>Loading...</div>;
    }

   
    const stripHtmlTags = (html) => {
      const div = document.createElement('div');
      div.innerHTML = html;
      return div.textContent || div.innerText || '';
    };

    return (
      <div className="show-details" ref={showDetailsRef}>
        <h2>{show.name}</h2>

        <div className="genres">
          {show.genres.map((genre, index) => (
            <span key={index} className="genre" style={{ color: 'black' }}>{genre}</span>
          ))}
        </div>
        <p>{stripHtmlTags(show.summary)}</p>
        <form onSubmit={handleBooking}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={bookingDetails.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={bookingDetails.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="ticketQuantity">Ticket Quantity:</label>
            <input
              type="number"
              id="ticketQuantity"
              name="ticketQuantity"
              value={bookingDetails.ticketQuantity}
              onChange={handleInputChange}
              min="1"
              max="10"
            />
          </div>
          <button type="submit">Book Ticket</button>
        </form>
      </div>
    );
  };

  return (
    <Router>
      <div className="container">
        <h1>TV Shows</h1>
        <ul className="show-list">
          {shows.map(show => (
            <li key={show.show.id} className={`show-card ${show.show.genres.join(' ')}`}>
              <Link to={`/show/${show.show.id}`} style={{ textDecoration: 'none' }}>
                <div className="show-thumbnail" style={{ backgroundImage: `url(${show.show.image.medium})` }}></div>
                <h3>{show.show.name}</h3>
                <p>Rating: {show.rating.average}</p>
                <div className="genres">
                  {show.show.genres.map((genre, index) => (
                    <span key={index} className="genre">{genre}</span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <Routes>
          <Route path="/show/:id" element={<ShowDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 









