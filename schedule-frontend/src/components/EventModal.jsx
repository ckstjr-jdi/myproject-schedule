// src/components/EventModal.jsx
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

export default function EventModal({
  show,
  onClose,
  event,
  onChange,
  onSave,
  onDelete,
}) {
  // ✅ event가 null/undefined여도 안전하게 처리
  const safeEvent = {
    id: "",
    title: "",
    start: "",
    end: "",
    memo: "",
    color: "#213758",
    ...(event || {}),
  };

  // Control 변경 공통 처리 (title, start, end, memo, color)
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...safeEvent, [name]: value });
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {safeEvent.id ? "🗓️일정 수정" : "🗓️일정 추가"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>제목</Form.Label>
          <Form.Control
            type="text"
            name="title"
            placeholder="일정제목을 입력해주세요"
            value={safeEvent.title ?? ""}
            onChange={handleChange}
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="mt-2">시작 날짜</Form.Label>
              <Form.Control
                type="datetime-local"
                name="start"
                value={safeEvent.start ?? ""}
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
                value={safeEvent.end ?? ""}
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
            value={safeEvent.memo ?? ""}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>색상</Form.Label>
          <Form.Control
            type="color"
            name="color"
            value={safeEvent.color ?? "#213758"}
            onChange={handleChange}
            style={{ width: 60, height: 40, padding: 2 }}
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        {/* 기존의 입력된 값이 있을 때만 삭제버튼 활성화 */}
        {safeEvent.id && (
          <Button variant="danger" onClick={onDelete}>
            삭제
          </Button>
        )}

        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>

        {/* 기존의 입력된 값이 있을 때는 수정, 없을 때는 저장버튼 활성화 */}
        <Button variant="primary" onClick={onSave}>
          {safeEvent.id ? "수정" : "저장"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
