import express from "express";

const router = express.Router();

// ✅ 임시 메모리 저장소
let schedules = [];

// 전체 조회
router.get("/", (req, res) => {
  res.json(schedules);
});

// 등록
router.post("/", (req, res) => {
  const newSchedule = {
    id: Date.now().toString(),
    ...req.body,
  };
  schedules.push(newSchedule);
  res.json(newSchedule);
});

// 수정
router.put("/:id", (req, res) => {
  const { id } = req.params;
  schedules = schedules.map((s) => (s.id === id ? { ...s, ...req.body } : s));
  res.json({ message: "updated" });
});

// 삭제
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  schedules = schedules.filter((s) => s.id !== id);
  res.json({ message: "deleted" });
});

export default router;
