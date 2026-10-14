"use client";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enNZ } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react"; 

const locales = {
  "en-NZ": enNZ,
};



const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function BookingCalendar() {
   const [events, setEvents] = useState<any[]>([]); // var for storing the events
   const [selectedEvent, setSelectedEvent] = useState<any>(null); //var for storing the selected event
   const [editBooking, setEditBooking] = useState({ //object used for editing selected event
  title: "",
  startTime: "",
  endTime: "",
});

// gets availability data from the API, currently from client view
  const loadAvailability = async () => {
    const response = await fetch("/api/availability");
    const data = await response.json();
    console.log("Availability data:", data); // Log the fetched data for debugging

    const calendarEvents = data.map((slot: any) => ({
      id: slot._id,
      title: slot.clientId || "Available",
      start: new Date(slot.startTime),
      end: new Date(slot.endTime),
    }));

    setEvents(calendarEvents);
  };
// to handle the selection of a time slot in calendar and send a POST request to API to save
  const handleSelectSlot = async ({ start, end }: any) => {
    const response = await fetch("/api/availability", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
        },
      body: JSON.stringify({
        trainerId: "test123",
        startTime: start,
        endTime: end,
      }),
    });

    const result = await response.json();

    console.log(result);
    loadAvailability();
  };


// handles when event is selected, sets the selected event to state so that it can be used for editing or deleting
  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
    setEditBooking({
      title: event.title,
      startTime: event.start.toISOString().slice(0, 16),
      endTime: event.end.toISOString().slice(0, 16),
    });
  };

 useEffect(() => {
    loadAvailability();
  }, []);

  return (
    <div style={{ height: "700px" }}>
      
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={(slot) => {
          if (!selectedEvent) { // only allow slot selection if no event is currently selected
            handleSelectSlot(slot);
          }
        }}
        onSelectEvent={handleSelectEvent}
      />
      
         {selectedEvent && (
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(224, 228, 230, 0.32)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,

        }}
      >
        <div
         style={{ display: "flex", flexDirection: "column", gap: "10px", 
          padding: "20px", background: "white", borderRadius: "8px"
         }}
        >
          <h3>Availability Options</h3>
        
          <input
            type="text"
            value={editBooking.title}
            onChange={(e) =>
              setEditBooking({
                ...editBooking,
                title: e.target.value,
              })
            }
          />
          
          <input
            type="datetime-local"
            value={editBooking.startTime}
            onChange={(e) =>
              setEditBooking({
                ...editBooking,
                startTime: e.target.value,
              })
            }
          />

          <input
            type="datetime-local"
            value={editBooking.endTime}
            onChange={(e) =>
              setEditBooking({
                ...editBooking,
                endTime: e.target.value,
              })
            }
          />

          <button
            onClick={async () => {
              await fetch("/api/availability", {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: selectedEvent.id,
                  ...editBooking,
                }),
              });

              setSelectedEvent(null);
              loadAvailability();
            }}
          >
            Save
          </button>

          <button
            onClick={async () => {

              const currentClientId = "client123"; // Replace with actual client ID from your authentication system
              
              await fetch("/api/availability", {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: selectedEvent.id,
                  clientId: currentClientId, // Assign the current client ID to the selected event
                }),
              });
              const response = await fetch("/api/availability", {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: selectedEvent.id,
                  clientId: currentClientId,
                }),
              });
              if (!response.ok) {
                alert("This slot has already been booked.");
                return;
              }

              setSelectedEvent(null);
              loadAvailability();
            }}
          >
            Book
          </button>
            
          <button
            onClick={async () => {
              await fetch("/api/availability", {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: selectedEvent.id,
                }),
              });

              setSelectedEvent(null); //reset the selected event after deletion
              loadAvailability();
            }}
          >
            Delete
          </button>

          <button onClick={() => setSelectedEvent(null)}>
            Cancel
          </button>
        </div>
      </div>
    )}
    </div>
  );
}
