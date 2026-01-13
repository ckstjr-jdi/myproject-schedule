import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import CalendarPage from './pages/CalendarPage'

const App = () => {
    const [events, setEvents] = useState([
      {
        id: "1",
        title: "테스트",
        start: "2026-01-13",
        end: "2026-01-13",
        color: "#3b82f6",
      },
      {
        id: "2",
        title: "운동",
        start: "2026-01-15",
        end: "2026-01-15",
        color: "#ef4444",
      },
      {
        id: "uuid-문자열", // 반드시 유니크
        title: "회의",
        start: "2026-01-24T10:00:00",
        end: "2026-01-24T11:00:00",
        memo: "줌 링크...",
        color: "#ec9209", // 선택
      },
    ]);
  return (
    <>
      <Routes>
        <Route path="/" element={<CalendarPage events={events} />} />
      </Routes>
    </>
  );
};

export default App;
