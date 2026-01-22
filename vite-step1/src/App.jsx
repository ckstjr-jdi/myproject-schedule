import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import CalendarPage from "./pages/CalendarPage";
import EventModal from "./components/EventModal";

const App = () => {
  const [show, setShow] = useState(false);
  const close = () => setShow(false);
  //기존 일정 값을 CalendarPage에 넘겨주는 함수
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "회의",
      start: "2026-01-24T10:00",
      end: "2026-01-24T11:00",
      memo: "줌 링크...",
      color: "#ec9209",
    },
  ]);

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
    if(newEvent.id) {
      //수정
      setEvents(prev =>//전에 값들 중에서
          prev.map(ev =>//하나씩 꺼내 와서
              //값의 id를 기존의 입력된 id랑 비교해서 같다면 수정 다르면 기존 값 그대로유지
              ev.id === newEvent.id ? newEvent : ev
          )
      );
      //등록
    } else {
      //기존의 일정 값과 새로 입력된 일정 값을 저장해주는 함수
      setEvents((prev) => [...prev, { ...newEvent, id: String(Date.now()) }]);// id 자동 생성
    
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
    if(!newEvent.id) return //입력된 값이 없으면 종료, 있으면 진행

    const ok = window.confirm("삭제하시겠습니까?") //삭제 전 물어보기
    if(!ok) return //취소버튼 클릭 시 종료, 확인버튼 클릭 시 진행

    //기존의 입력된 배열 값을 가져와서 클릭한 값과 같지 않은 것만 출력
    //클릭된 값은 조건에서 제외 되므로 삭제
    setEvents(prev => prev.filter((event) => event.id !== newEvent.id));
    //필터가 끝난 후 모달 닫기
    close()
    };

  //날짜를 타입을 맞춰주는 함수
  const EventClickDate = (s) => (s ? s.slice(0, 16) : "");
  //입력된 일정 값을 클릭 했을 때 상세 함수
  const onEventClick = (info) => {
    setShow(true);
    const e = info.event;
    console.log(e)
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
