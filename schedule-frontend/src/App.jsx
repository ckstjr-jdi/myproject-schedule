import { useCallback, useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import CalendarPage from "./pages/CalendarPage";
import EventModal from "./components/EventModal";

// ✅ Express API 연동
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "./service/schedulesApi";

const App = () => {
  const [show, setShow] = useState(false);
  const close = () => setShow(false);

  const [events, setEvents] = useState([]);

  // ✅ 서버에서 일정 불러오기 (함수 고정)
  const fetchEvents = useCallback(async () => {
    try {
      const data = await getSchedules();
      setEvents(data);
    } catch (err) {
      console.error("GET /api/schedules error:", err);
      window.alert("일정 불러오기 실패! 백엔드 서버가 켜져있는지 확인해줘.");
    }
  }, []);

  // ✅ (React 18 개발모드 StrictMode) effect 2번 실행 방지 가드
  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    fetchEvents();
  }, [fetchEvents]);

  // 새 일정/수정 일정 상태
  const [newEvent, setNewEvent] = useState({
    id: "",
    title: "",
    start: "",
    end: "",
    memo: "",
    color: "#213758",
  });

  // 날짜 클릭 → 모달 오픈 + 기본 시간 세팅
  const onDateClick = (info) => {
    setShow(true);

    const clickedDate = info.dateStr;
    const now = new Date();

    const clickStartDateHour = `${clickedDate}T${String(now.getHours() + 1).padStart(2, "0")}:00`;
    const clickEndDateHour = `${clickedDate}T${String(now.getHours() + 2).padStart(2, "0")}:00`;

    setNewEvent({
      id: "",
      title: "",
      start: clickStartDateHour,
      end: clickEndDateHour,
      memo: "",
      color: "#213758",
    });
  };

  // 날짜 타입 맞추기 (FullCalendar → input datetime-local)
  const EventClickDate = (s) => (s ? s.slice(0, 16) : "");

  // 이벤트 클릭 → 모달 오픈 + 기존 값 채우기
  const onEventClick = (info) => {
    setShow(true);
    const e = info.event;

    const start = EventClickDate(e.startStr);
    const end = EventClickDate(e.endStr);

    setNewEvent({
      id: e.id,
      title: e.title,
      start,
      end,
      memo: e.extendedProps?.memo ?? "",
      color: e.backgroundColor ?? "#213758",
    });
  };

  // ✅ 저장(추가/수정) - Express API 연결
  const handleSave = async () => {
    if (newEvent.start > newEvent.end) {
      window.alert("시작날짜보다 종료날짜가 큽니다.");
      return;
    }

    const payload = {
      title: newEvent.title,
      start: newEvent.start,
      end: newEvent.end,
      memo: newEvent.memo || "",
      color: newEvent.color || "#213758",
    };

    try {
      if (newEvent.id) {
        await updateSchedule(newEvent.id, payload);
      } else {
        await createSchedule(payload);
      }

      await fetchEvents();
      close();
    } catch (err) {
      console.error("Save error:", err);
      window.alert("저장 중 오류가 발생했습니다. 콘솔을 확인해주세요.");
    }
  };

  // ✅ 삭제 - Express API 연결
  const handleDelete = async () => {
    if (!newEvent.id) return;

    const ok = window.confirm("삭제하시겠습니까?");
    if (!ok) return;

    try {
      await deleteSchedule(newEvent.id);
      await fetchEvents();
      close();
    } catch (err) {
      console.error("Delete error:", err);
      window.alert("삭제 중 오류가 발생했습니다. 콘솔을 확인해주세요.");
    }
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <CalendarPage
              events={events}
              onDateClick={onDateClick}
              onEventClick={onEventClick}
            />
          }
        />
      </Routes>

      <EventModal
        show={show}
        onClose={close}
        event={newEvent}
        onChange={setNewEvent}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </>
  );
};

export default App;
