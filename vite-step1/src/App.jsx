import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import CalendarPage from "./pages/CalendarPage";
import EventModal from "./components/EventModal";

// firebase
import { db } from "./service/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const COLLECTION = "schedules";

const App = () => {
  const [show, setShow] = useState(false);
  const close = () => setShow(false);

  const [events, setEvents] = useState([]);

  // ✅ Firestore 구독(실시간 읽기)
  useEffect(() => {
    const q = query(
      collection(db, COLLECTION),
      orderBy("SCHEDULE_START", "asc"),
    );

    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: data.SCHEDULE_TITLE ?? "",
          start: data.SCHEDULE_START ?? "",
          end: data.SCHEDULE_END ?? "",
          memo: data.SCHEDULE_CONTENT ?? "",
          color: data.COLOR ?? "#213758",
        };
      });

      setEvents(rows);
    });

    return () => unsub();
  }, []);

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

  // ✅ 저장(추가/수정) - Firestore에 완전 연결
  const handleSave = async () => {
    if (newEvent.start > newEvent.end) {
      window.alert("시작날짜보다 종료날짜가 큽니다.");
      return;
    }

    // 공통 payload
    const payload = {
      SCHEDULE_TITLE: newEvent.title,
      SCHEDULE_START: newEvent.start,
      SCHEDULE_END: newEvent.end,
      SCHEDULE_CONTENT: newEvent.memo || "",
      COLOR: newEvent.color || "#213758",
      updatedAt: serverTimestamp(),
    };

    try {
      if (newEvent.id) {
        // ✅ 수정
        const ref = doc(db, COLLECTION, newEvent.id);
        await updateDoc(ref, payload);
      } else {
        // ✅ 등록
        await addDoc(collection(db, COLLECTION), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      }

      // onSnapshot이 다시 내려주므로 로컬 events 만지지 않아도 됨
      close();
    } catch (err) {
      console.error("Firestore save error:", err);
      window.alert("저장 중 오류가 발생했습니다. 콘솔을 확인해주세요.");
    }
  };

  // ✅ 삭제 - Firestore에 완전 연결
  const handleDelete = async () => {
    if (!newEvent.id) return;

    const ok = window.confirm("삭제하시겠습니까?");
    if (!ok) return;

    try {
      const ref = doc(db, COLLECTION, newEvent.id);
      await deleteDoc(ref);

      // onSnapshot이 다시 내려주므로 로컬 events 만지지 않아도 됨
      close();
    } catch (err) {
      console.error("Firestore delete error:", err);
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
