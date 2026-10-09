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
   const [events, setEvents] = useState<any[]>([]);

  const loadAvailability = async () => {
    const response = await fetch("/api/availability");
    const data = await response.json();

    const calendarEvents = data.map((slot: any) => ({
      title: "Available",
      start: new Date(slot.startTime),
      end: new Date(slot.endTime),
    }));

    setEvents(calendarEvents);
  };

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
        onSelectSlot={handleSelectSlot}
      />
    </div>
  );
}
