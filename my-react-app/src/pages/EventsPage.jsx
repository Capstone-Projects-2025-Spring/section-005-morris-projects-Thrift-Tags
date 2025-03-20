import React, { useState } from "react";
import '../eventsPage.css';

const EventsPage = ({ onEvent }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventHost, setEventHost] = useState("");
  const [eventPrivacy, setEventPrivacy] = useState("Public");
  const [filterInput, setFilterInput] = useState("");
  const [locationMessage, setLocationMessage] = useState("");

  const [events, setEvents] = useState([
    {
      name: "Thrift Sales",
      location: "Philadelphia, Pennsylvania",
      host: "Me",
      privacy: "Private"
    }
  ]);

  const [filteredEvents, setFilteredEvents] = useState(events);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setEventName("");
    setEventLocation("");
    setEventHost("");
    setEventPrivacy("Public");
    setIsPopupOpen(false);
  };

  const handleOutsideClick = (event) => {
    if (event.target.className === "popup") {
      closePopup();
    }
  };

  const handleSubmit = () => {
    if (eventName.trim() !== "") {
      const newEvent = {
        name: eventName,
        location: eventLocation || "TBD",
        host: eventHost || "Me",
        privacy: eventPrivacy || "Public"
      };

      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      setFilteredEvents(updatedEvents); // Update filtered list too

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

    setFilteredEvents(sortedList); // Update filtered events with sorted list
  };

  const doFilter = () => {
    const lowercasedFilter = filterInput.toLowerCase();
    const newList = events.filter(event =>
      event.name.toLowerCase().includes(lowercasedFilter) ||
      event.location.toLowerCase().includes(lowercasedFilter) ||
      event.host.toLowerCase().includes(lowercasedFilter) ||
      event.privacy.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredEvents(newList);
  };

  const clearFilter = () => {
    setFilterInput("");
    setFilteredEvents(events);
  };

  // Function to check if an event is hosted by me
  const isMyEvent = (host) => {
    if (!host) return false;
    const hostLower = host.toLowerCase();
    return hostLower === "me" || hostLower === "myself";
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
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event, index) => (
              <tr
                key={index}
                className={isMyEvent(event.host) ? "my-event-row" : ""}
              >
                <td>{event.name}</td>
                <td>{event.location}</td>
                <td>{event.host}</td>
                <td>{event.privacy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsPage;