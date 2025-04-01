import React, { useState, useEffect } from "react";
import '../eventsPage.css';

const EventsPage = ({ onEvent }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDetailsPopupOpen, setIsDetailsPopupOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventHost, setEventHost] = useState("");
  const [eventPrivacy, setEventPrivacy] = useState("Public");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [filterInput, setFilterInput] = useState("");
  const [locationMessage, setLocationMessage] = useState("");

  const [events, setEvents] = useState([
    {
      name: "Thrift Sales",
      location: "Philadelphia, Pennsylvania",
      host: "Me",
      privacy: "Private",
      date: "2025-07-15",
      time: "14:00"
    },
    {
      name: "Your Thrift Event",
      location: "Atlanta, Georgia",
      host: "Kevin",
      privacy: "Public",
      date: "2024-08-20",
      time: "10:30"
    }
  ]);

  const [filteredEvents, setFilteredEvents] = useState(events);

  // Countdown Component
  const Countdown = ({ event }) => {
    const [timeLeft, setTimeLeft] = useState({});

    useEffect(() => {
      const calculateTimeLeft = () => {
        const eventDateTime = new Date(`${event.date}T${event.time}`);
        const difference = eventDateTime - new Date();

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((difference / 1000 / 60) % 60);
          const seconds = Math.floor((difference / 1000) % 60);

          return { days, hours, minutes, seconds };
        }

        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      };

      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(timer);
    }, [event.date, event.time]);

    return (
      <div className="countdown">
        <h4>Countdown to Event</h4>
        <div className="countdown-display">
          <div><strong>{timeLeft.days}</strong> Days</div>
          <div><strong>{timeLeft.hours}</strong> Hours</div>
          <div><strong>{timeLeft.minutes}</strong> Minutes</div>
          <div><strong>{timeLeft.seconds}</strong> Seconds</div>
        </div>
      </div>
    );
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setEventName("");
    setEventLocation("");
    setEventHost("");
    setEventDate("");
    setEventTime("");
    setEventPrivacy("Public");
    setIsPopupOpen(false);
  };

  const openDetailsPopup = (event) => {
    setSelectedEvent(event);
    setIsDetailsPopupOpen(true);
  };

  const closeDetailsPopup = () => {
    setSelectedEvent(null);
    setIsDetailsPopupOpen(false);
  };

  const handleOutsideClick = (event) => {
    if (event.target.className === "popup") {
      closePopup();
      closeDetailsPopup();
    }
  };

  const handleSubmit = () => {
    if (eventName.trim() !== "") {
      const newEvent = {
        name: eventName,
        location: eventLocation || "TBD",
        host: eventHost || "Me",
        privacy: eventPrivacy || "Public",
        date: eventDate || new Date().toISOString().split('T')[0],
        time: eventTime || "00:00"
      };

      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      setFilteredEvents(updatedEvents);

      if (onEvent) {
        onEvent(updatedEvents);
      }

      closePopup();
    }
  };

  const sortByProp = (propName, sortType) => {
    const sortedList = [...filteredEvents].sort((a, b) => {
      let valA = a[propName];
      let valB = b[propName];

      // Handle null or undefined values
      if (valA == null) valA = "";
      if (valB == null) valB = "";

      // If it's a dollar amount, remove '$' and ',' before converting to a number
      if (sortType === "currency") {
        valA = parseFloat(valA.replace(/[$,]/g, "")) || 0;
        valB = parseFloat(valB.replace(/[$,]/g, "")) || 0;
      } else if (sortType === "number") {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      } else if (sortType === "date") {
        valA = new Date(valA);
        valB = new Date(valB);
      } else { // Default to text sorting
        valA = valA.toString();
        valB = valB.toString();
      }

      return valA > valB ? 1 : valA < valB ? -1 : 0;
    });

    setFilteredEvents(sortedList);
  };

  const doFilter = () => {
    const lowercasedFilter = filterInput.toLowerCase();
    const newList = events.filter(event =>
      event.name.toLowerCase().includes(lowercasedFilter) ||
      event.location.toLowerCase().includes(lowercasedFilter) ||
      event.host.toLowerCase().includes(lowercasedFilter) ||
      event.privacy.toLowerCase().includes(lowercasedFilter) ||
      event.date.toLowerCase().includes(lowercasedFilter) ||
      event.time.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredEvents(newList);
  };

  const clearFilter = () => {
    setFilterInput("");
    setFilteredEvents(events);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      setLocationMessage("Getting your location...");
      navigator.geolocation.getCurrentPosition(
        // Success callback
        (position) => {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;

          // Use reverse geocoding to get city and state
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&addressdetails=1`)
            .then(response => response.json())
            .then(data => {
              // Extract city and state from the response
              const city = data.address.city || data.address.town || data.address.village || '';
              const state = data.address.state || '';
              const country = data.address.country || '';

              // Format the location string
              const locationString = city && state ? `${city}, ${state}` :
                city ? `${city}, ${country}` :
                  state ? `${state}, ${country}` :
                    "Location found";

              // Update the location input
              setEventLocation(locationString);
              setLocationMessage("Location found!");
            })
            .catch(error => {
              console.error("Error fetching address:", error);
              setLocationMessage("Couldn't retrieve address. Using coordinates instead.");
              setEventLocation(`Near ${lat.toFixed(3)}, ${long.toFixed(3)}`);
            });
        },
        // Error callback
        (err) => {
          switch (err.code) {
            case 1:
              setLocationMessage("User denied the request for Geolocation.");
              break;
            case 2:
              setLocationMessage("Location information is unavailable.");
              break;
            case 3:
              setLocationMessage("The request to get user location timed out.");
              break;
            default:
              setLocationMessage("An unknown error occurred.");
              break;
          }
        }
      );
    } else {
      setLocationMessage("Geolocation is not supported by this browser.");
    }
  };

  // Function to check if an event is hosted by me
  const isMyEvent = (host) => {
    if (!host) return false;
    const hostLower = host.toLowerCase();
    return hostLower === "me" || hostLower === "myself";
  };

  const handleDeleteEvent = (eventToDelete, index, e) => {
    // Stop the event from bubbling up to the row click handler
    e.stopPropagation();

    // Show confirmation dialog
    if (window.confirm(`Are you sure you want to delete "${eventToDelete.name}"?`)) {
      const updatedEvents = events.filter((_, i) => i !== index);
      setEvents(updatedEvents);
      setFilteredEvents(updatedEvents.filter(event =>
        event.name.toLowerCase().includes(filterInput.toLowerCase()) ||
        event.location.toLowerCase().includes(filterInput.toLowerCase()) ||
        event.host.toLowerCase().includes(filterInput.toLowerCase()) ||
        event.privacy.toLowerCase().includes(filterInput.toLowerCase()) ||
        event.date.toLowerCase().includes(filterInput.toLowerCase()) ||
        event.time.toLowerCase().includes(filterInput.toLowerCase())
      ));

      // Notify parent component if needed
      if (onEvent) {
        onEvent(updatedEvents);
      }
    }
  };

  return (
    <div className="body-wrapper">
      <div className="eventsContainer">
        <div className="eventTitle">Events Page</div>
        <input
          value={filterInput}
          onChange={(e) => setFilterInput(e.target.value)}
          placeholder="Search events..."
        />
        &nbsp;
        <button onClick={doFilter}>Search</button>
        &nbsp;
        <button onClick={clearFilter}>Clear Search</button>
        <button className="createEventButton" onClick={openPopup}>Create Event</button>

        {/* Create Event Popup */}
        <div id="myPopup" className="popup" style={{ display: isPopupOpen ? "block" : "none" }} onClick={handleOutsideClick}>
          <div className="popup-content">
            <span className="close" onClick={closePopup}>&times;</span>
            <h3>Create New Event</h3>
            <input
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Event name"
            /> <br />
            <input
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              placeholder="Event Location"
            />
            <button type="button" onClick={getLocation}>Use my location</button>
            {locationMessage && <div className="location-message">{locationMessage}</div>}
            <input
              value={eventHost}
              onChange={(e) => setEventHost(e.target.value)}
              placeholder="Who's Hosting"
            /> <br />

            {/* Date and Time Inputs */}
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              placeholder="Event Date"
            />
            <input
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              placeholder="Event Time"
            />

            {/* Privacy selection with radio buttons */}
            <div className="privacy-options">
              <label>Privacy:</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="privacy"
                    value="Public"
                    checked={eventPrivacy === "Public"}
                    onChange={() => setEventPrivacy("Public")}
                  />
                  Public
                </label>
                <label>
                  <input
                    type="radio"
                    name="privacy"
                    value="Private"
                    checked={eventPrivacy === "Private"}
                    onChange={() => setEventPrivacy("Private")}
                  />
                  Private
                </label>
              </div>
            </div>
            <br />

            <button onClick={handleSubmit}>Create</button>
          </div>
        </div>

        {/* Event Details Popup */}
        {isDetailsPopupOpen && selectedEvent && (
          <div className="popup" onClick={handleOutsideClick}>
            <div className="popup-content">
              <span className="close" onClick={closeDetailsPopup}>&times;</span>
              <h3>Event Details</h3>
              <div className="event-details">
                <p><strong>Event Name:</strong> {selectedEvent.name}</p>
                <p><strong>Location:</strong> {selectedEvent.location}</p>
                <p><strong>Host:</strong> {selectedEvent.host}</p>
                <p><strong>Privacy:</strong> {selectedEvent.privacy}</p>
                <p><strong>Date:</strong> {selectedEvent.date}</p>
                <p><strong>Time:</strong> {selectedEvent.time}</p>
              </div>
              <Countdown event={selectedEvent} />
            </div>
          </div>
        )}

        <table>
          <thead>
            <tr>
              <th onClick={() => sortByProp("name", "text")}>
                <span style={{ cursor: "pointer" }}>⇅</span>Event Name</th>
              <th onClick={() => sortByProp("location", "text")}>
                <span style={{ cursor: "pointer" }}>⇅</span>Event Location</th>
              <th onClick={() => sortByProp("host", "text")}>
                <span style={{ cursor: "pointer" }}>⇅</span>Hosting</th>
              <th onClick={() => sortByProp("privacy", "text")}>
                <span style={{ cursor: "pointer" }}>⇅</span>Private/Public</th>
              <th onClick={() => sortByProp("date", "date")}>
                <span style={{ cursor: "pointer" }}>⇅</span>Date</th>
              <th onClick={() => sortByProp("time", "text")}>
                <span style={{ cursor: "pointer" }}>⇅</span>Time</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event, index) => (
              <tr
                key={index}
                className={isMyEvent(event.host) ? "my-event-row" : ""}
                onClick={() => openDetailsPopup(event)}
                style={{ cursor: "pointer" }}
              >
                <td>{event.name}</td>
                <td>{event.location}</td>
                <td>{event.host}</td>
                <td>{event.privacy}</td>
                <td>{event.date}</td>
                <td>{event.time}</td>
                <td className="delete-cell" onClick={(e) => handleDeleteEvent(event, index, e)}>
                  {/* You can use an icon if you have them imported */}
                  {/* <Trash size={16} /> */}
                  🗑️
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsPage;