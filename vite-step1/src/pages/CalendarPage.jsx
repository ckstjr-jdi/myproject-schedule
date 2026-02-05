// src/pages/CalendarPage.jsx
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import Header from "../components/Header";
import "../styles/layout.css";

export default function CalendarPage({ events, onDateClick, onEventClick }) {
  // ✅ FullCalendar가 이해하는 형태로 변환 (memo는 extendedProps로!)
  const fcEvents = (events || []).map((e) => ({
    id: e.id,
    title: e.title,
    start: e.start,
    end: e.end,
    backgroundColor: e.color,
    borderColor: e.color,
    extendedProps: {
      memo: e.memo,
    },
  }));

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
          events={fcEvents}
          dateClick={onDateClick}
          eventClick={onEventClick}
          selectable={true}
        />
      </div>
    </>
  );
}
