import React, { useState, useEffect } from "react";
import '../eventsPage.css';

const EventsPage = ({ onEvent }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDetailsPopupOpen, setIsDetailsPopupOpen] = useState(false);
  const [isHistoryPopupOpen, setIsHistoryPopupOpen] = useState(false);
  const [isRestorePopupOpen, setIsRestorePopupOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventToRestore, setEventToRestore] = useState(null);
  const [restoreEventIndex, setRestoreEventIndex] = useState(null);
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventHost, setEventHost] = useState("");
  const [eventPrivacy, setEventPrivacy] = useState("Public");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [filterInput, setFilterInput] = useState("");
  const [locationMessage, setLocationMessage] = useState("");
  
  // State for event history
  const [eventHistory, setEventHistory] = useState([]);

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

  // Function to move event to history
  const moveToHistory = (eventToMove, reason) => {
    // Generate a unique key for the event
    const eventKey = `${eventToMove.name}-${eventToMove.date}-${eventToMove.time}`;
    
    // Check if the event is already in history using the unique key
    const isAlreadyInHistory = eventHistory.some(histEvent => {
      const histEventKey = `${histEvent.name}-${histEvent.date}-${histEvent.time}`;
      return histEventKey === eventKey;
    });
    
    if (isAlreadyInHistory) return;
    
    // Create history record
    const timestamp = new Date().toLocaleString();
    const historyEvent = {
      ...eventToMove,
      removedOn: timestamp,
      reason: reason // "deleted" or "expired"
    };
    
    // Add to history
    setEventHistory(prevHistory => [...prevHistory, historyEvent]);
    
    // Remove from active events list if expired
    if (reason === "expired") {
      const updatedEvents = events.filter(event => {
        const currentEventKey = `${event.name}-${event.date}-${event.time}`;
        return currentEventKey !== eventKey;
      });
      
      setEvents(updatedEvents);
      setFilteredEvents(updatedEvents);
      
      // Notify parent component if needed
      if (onEvent) {
        onEvent(updatedEvents);
      }
    }
  };

  // Countdown Component
  const Countdown = ({ event }) => {
    const [timeLeft, setTimeLeft] = useState({});
    const [isExpired, setIsExpired] = useState(false);

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
        
        // If countdown ended and event not already marked as expired
        if (!isExpired) {
          setIsExpired(true);
          moveToHistory(event, "expired");
        }

        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      };

      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      // Initial calculation to handle already expired events
      setTimeLeft(calculateTimeLeft());

      return () => clearInterval(timer);
    }, [event, isExpired]);

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

  // History popup functions
  const openHistoryPopup = () => {
    setIsHistoryPopupOpen(true);
  };

  const closeHistoryPopup = () => {
    setIsHistoryPopupOpen(false);
  };

  // Restore popup functions
  const openRestorePopup = (event, index) => {
    // Set initial values from the history event
    setEventToRestore(event);
    setRestoreEventIndex(index);
    setEventDate(event.date);
    setEventTime(event.time);
    setIsRestorePopupOpen(true);
  };

  const closeRestorePopup = () => {
    setEventToRestore(null);
    setRestoreEventIndex(null);
    setIsRestorePopupOpen(false);
  };

  const handleOutsideClick = (event) => {
    if (event.target.className === "popup") {
      closePopup();
      closeDetailsPopup();
      closeHistoryPopup();
      closeRestorePopup();
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

  // Sort history by date
  const sortHistory = (propName, sortType = "date") => {
    const sortedHistory = [...eventHistory].sort((a, b) => {
      if (sortType === "date") {
        const dateA = new Date(a.removedOn);
        const dateB = new Date(b.removedOn);
        return dateB - dateA; // Sort from newest to oldest
      }
      return a[propName] > b[propName] ? 1 : a[propName] < b[propName] ? -1 : 0;
    });
    
    setEventHistory(sortedHistory);
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
      // Add to history before removing
      moveToHistory(eventToDelete, "deleted");
      
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

  // Function to restore an event from history with option to update date/time
  const restoreEvent = () => {
    if (!eventToRestore) return;
    
    // Create a new event object without history-specific properties and with updated date/time
    const { removedOn, reason, ...restoredEventBase } = eventToRestore;
    const restoredEvent = {
      ...restoredEventBase,
      date: eventDate,
      time: eventTime
    };
    
    // Add back to active events
    const updatedEvents = [...events, restoredEvent];
    setEvents(updatedEvents);
    setFilteredEvents(updatedEvents);
    
    // Remove from history
    const updatedHistory = eventHistory.filter((_, i) => i !== restoreEventIndex);
    setEventHistory(updatedHistory);
    
    // Notify parent if needed
    if (onEvent) {
      onEvent(updatedEvents);
    }
    
    // Close popup
    closeRestorePopup();
  };

  // Remove duplicate events from history
  useEffect(() => {
    const uniqueEvents = [];
    const eventKeys = new Set();
    
    eventHistory.forEach(event => {
      const eventKey = `${event.name}-${event.date}-${event.time}-${event.host}`;
      if (!eventKeys.has(eventKey)) {
        eventKeys.add(eventKey);
        uniqueEvents.push(event);
      }
    });
    
    // Only update if we actually removed duplicates
    if (uniqueEvents.length !== eventHistory.length) {
      setEventHistory(uniqueEvents);
    }
  }, [eventHistory]);

  // Check for expired events on component mount and when events change
  useEffect(() => {
    const checkForExpiredEvents = () => {
      const now = new Date();
      const expiredEventIndices = [];
      
      events.forEach((event, index) => {
        const eventDateTime = new Date(`${event.date}T${event.time}`);
        if (eventDateTime <= now) {
          expiredEventIndices.push(index);
          
          // Only move to history if not already there
          moveToHistory(event, "expired");
        }
      });
      
      // Remove expired events from the events list (if any)
      if (expiredEventIndices.length > 0) {
        const updatedEvents = events.filter((_, index) => !expiredEventIndices.includes(index));
        setEvents(updatedEvents);
        setFilteredEvents(updatedEvents);
        
        // Notify parent if needed
        if (onEvent) {
          onEvent(updatedEvents);
        }
      }
    };
    
    // Check on mount
    checkForExpiredEvents();
    
    // Set up interval to check regularly
    const intervalId = setInterval(checkForExpiredEvents, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [events]);

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
        <button className="historyButton" onClick={openHistoryPopup}>Event History</button>

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

        {/* Event History Popup */}
        {isHistoryPopupOpen && (
          <div className="popup" onClick={handleOutsideClick}>
            <div className="popup-content history-popup">
              <span className="close" onClick={closeHistoryPopup}>&times;</span>
              <h3>Event History</h3>
              {eventHistory.length === 0 ? (
                <div className="no-history">No past events available.</div>
              ) : (
                <div className="history-container">
                  <div className="history-tabs">
                    <button onClick={() => sortHistory("removedOn")}>Sort by Date</button>
                    <button onClick={() => sortHistory("name", "text")}>Sort by Name</button>
                    <button onClick={() => sortHistory("reason", "text")}>Sort by Reason</button>
                  </div>
                  <div className="history-list">
                    {eventHistory.map((historyEvent, index) => (
                      <div key={index} className="history-item">
                        <div className="history-header">
                          <h4>{historyEvent.name}</h4>
                          <span className={`history-tag ${historyEvent.reason}`}>
                            {historyEvent.reason === "expired" ? "Completed" : "Deleted"}
                          </span>
                        </div>
                        <p><strong>Location:</strong> {historyEvent.location}</p>
                        <p><strong>Host:</strong> {historyEvent.host}</p>
                        <p><strong>Original Date/Time:</strong> {historyEvent.date} at {historyEvent.time}</p>
                        <p><strong>Removed On:</strong> {historyEvent.removedOn}</p>
                        <button onClick={() => openRestorePopup(historyEvent, index)}>
                          Restore Event
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Restore Event Popup with Date/Time editing */}
        {isRestorePopupOpen && eventToRestore && (
          <div className="popup" onClick={handleOutsideClick}>
            <div className="popup-content">
              <span className="close" onClick={closeRestorePopup}>&times;</span>
              <h3>Restore Event</h3>
              <div className="event-details">
                <p><strong>Event Name:</strong> {eventToRestore.name}</p>
                <p><strong>Location:</strong> {eventToRestore.location}</p>
                <p><strong>Host:</strong> {eventToRestore.host}</p>
                <p><strong>Privacy:</strong> {eventToRestore.privacy}</p>
              </div>
              
              <div className="restore-date-time">
                <h4>Update Date and Time</h4>
                <div className="date-time-inputs">
                  <label>
                    New Date:
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                    />
                  </label>
                  <label>
                    New Time:
                    <input
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                    />
                  </label>
                </div>
              </div>
              
              <button onClick={restoreEvent}>Restore with Updated Date/Time</button>
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