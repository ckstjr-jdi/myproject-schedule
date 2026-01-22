// src/pages/CalendarPage.jsx
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import Header from "../components/Header";

import "../styles/layout.css";

export default function CalendarPage({ events, onDateClick, onEventClick }) {
  return (
    <>
      <Header />
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          dateClick={onDateClick}
          eventClick={onEventClick}
          selectable={true}
        />
      </div>
    </>
  );
}
