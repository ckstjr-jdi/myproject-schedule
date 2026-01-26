import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import CalendarPage from "./pages/CalendarPage";
import EventModal from "./components/EventModal";
// firebase
import { db } from "./service/firebase"; // 네가 만든 firebase 초기화 파일 경로에 맞게
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
  //기존 일정 값을 CalendarPage에 넘겨주는 함수
const [events, setEvents] = useState([]);
useEffect(() => {
  console.log("🔥 Firestore 구독 시작");

  const q = query(collection(db, COLLECTION), orderBy("SCHEDULE_START", "asc"));

  const unsub = onSnapshot(q, (snap) => {
    console.log("✅ snap size:", snap.size);
    const rows = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        title: data.SCHEDULE_TITLE,
        start: data.SCHEDULE_START,
        end: data.SCHEDULE_END,
        memo: data.SCHEDULE_CONTENT,
        color: data.COLOR,
      };
    });

    console.log("📦 rows:", rows);
    setEvents(rows);
  });

  return () => {
    console.log("🧹 Firestore 구독 해제");
    unsub();
  };
}, []);


  //새로운 일정 값 넣어주는 함수
  const [newEvent, setNewEvent] = useState({
    id: "",
    title: "",
    start: "",
    end: "",
    memo: "",
    color: "",
  });

  //날짜를 클릭했을 때 모달창을 열어주는 함수
  const onDateClick = (info) => {
    setShow(true);
    //클릭 날짜 시간 가져오는 코드
    const clickeDate = info.dateStr;
    const now = new Date();

    const clickStartDateHour = `${clickeDate}T${
      String(now.getHours() + 1).padStart(2, "0") + ":00"
    }`;
    const clickEndDateHour = `${clickeDate}T${
      String(now.getHours() + 2).padStart(2, "0") + ":00"
    }`;

    //모달이 열릴 때 초기 값
    setNewEvent({
      title: "",
      start: clickStartDateHour,
      end: clickEndDateHour,
      memo: "",
      color: "#213758",
    });
  };

  //저장 및 수정 함수
  const handleSave = () => {
    //기존의 입력된 값이 있으면 수정, 없으면 등록
    if (newEvent.id) {
      //수정
      if (newEvent.start > newEvent.end) {
        //시작날짜 < 종료날짜 일때 저장가능 유효성검사
        window.alert("시작날짜보다 종료날짜가 큽니다.");
        return;
      } else {
        setEvents(
          (
            prev, //전에 값들 중에서
          ) =>
            prev.map(
              (
                ev, //하나씩 꺼내 와서
              ) =>
                //값의 id를 기존의 입력된 id랑 비교해서 같다면 수정 다르면 기존 값 그대로유지
                ev.id === newEvent.id ? newEvent : ev,
            ),
        );
      }
      //등록
    } else {
      if (newEvent.start > newEvent.end) {
        window.alert("시작날짜보다 종료날짜가 큽니다.");
        return;
      } else {
        //기존의 일정 값과 새로 입력된 일정 값을 저장해주는 함수
        setEvents((prev) => [...prev, { ...newEvent, id: String(Date.now()) }]); // id 자동 생성
      }
      //저장하고 모달을 초기화 시켜주는 함수
      setNewEvent({
        title: "",
        start: "",
        end: "",
        memo: "",
        color: "#7c5cff",
      });
    }
    close();
  };
  //삭제 함수
  const handleDelete = () => {
    if (!newEvent.id) return; //입력된 값이 없으면 종료, 있으면 진행

    const ok = window.confirm("삭제하시겠습니까?"); //삭제 전 물어보기
    if (!ok) return; //취소버튼 클릭 시 종료, 확인버튼 클릭 시 진행

    //기존의 입력된 배열 값을 가져와서 클릭한 값과 같지 않은 것만 출력
    //클릭된 값은 조건에서 제외 되므로 삭제
    setEvents((prev) => prev.filter((event) => event.id !== newEvent.id));
    //필터가 끝난 후 모달 닫기
    close();
  };

  //날짜를 타입을 맞춰주는 함수
  const EventClickDate = (s) => (s ? s.slice(0, 16) : "");
  //입력된 일정 값을 클릭 했을 때 상세 함수
  const onEventClick = (info) => {
    setShow(true);
    const e = info.event;
    console.log(e);
    const start = EventClickDate(e.startStr);
    const end = EventClickDate(e.endStr);
    setNewEvent({
      id: e.id,
      title: e.title,
      start: start,
      end: end,
      memo: e.extendedProps.memo,
      color: e.backgroundColor,
    });
  };

  return (
    <>
      {/* CalendarPage.jsx에 프롭스로 값을 보내주는 라우트 */}
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

      {/* 이벤트 모달을 띄워주는 컴포넌트 */}
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
