// src/components/EventModal.jsx
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

export default function EventModal({ show, onClose, event, onChange, onSave }) {
  // Control 변경 공통 처리 (title, start, end, memo, color)
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log({ name, value });
    //변화되는 값을 실시간으로 갖고 있다가 저장 버튼이 눌리면 setNewEvent값으로 들어감
    onChange({ ...event, [name]: value });
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {event.id ? "📅일정 수정" : "📅새로운 일정 추가"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>제목</Form.Label>
          <Form.Control
            type="text"
            name="title"
            placeholder="일정제목을 입력해주세요"
            value={event.title} //화면에 초기 값을 보여주고 변화 시 변화된 값을
            onChange={handleChange} //Control창에 변화가 있으면 handleChange로 값을 실시간 전송해줌
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="mt-2">시작 날짜</Form.Label>
              <Form.Control
                type="datetime-local"
                name="start"
                value={event.start}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="mt-2">종료 날짜</Form.Label>
              <Form.Control
                type="datetime-local"
                name="end"
                value={event.end}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>메모</Form.Label>
          <Form.Control
            as="textarea"
            name="memo"
            placeholder="메모"
            value={event.memo}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>색상</Form.Label>
          <Form.Control
            type="color"
            name="color"
            value={event.color}
            onChange={handleChange}
            style={{ width: 60, height: 40, padding: 2 }}
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button variant="primary" onClick={onSave}>
          {event.id ? "수정" : "저장"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
