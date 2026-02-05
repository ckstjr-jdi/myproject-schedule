// src/routes/schedules.routes.js
const router = require("express").Router();
const { schedules } = require("../data/schedules.mock");

// 간단 id 생성(라이브러리 없이)
const makeId = () => Date.now().toString();

// ✅ 전체 조회
router.get("/", (req, res) => {
  res.json(schedules);
});

// ✅ 단건 조회
router.get("/:id", (req, res) => {
  const found = schedules.find((s) => s.id === req.params.id);
  if (!found)
    return res.status(404).json({ message: "일정을 찾을 수 없습니다." });
  res.json(found);
});

// ✅ 등록
router.post("/", (req, res) => {
  const { title, start, end, color, category } = req.body;

  if (!title || !start || !end) {
    return res.status(400).json({ message: "title, start, end는 필수입니다." });
  }
  if (start > end) {
    return res
      .status(400)
      .json({ message: "start는 end보다 늦을 수 없습니다." });
  }

  const newSchedule = {
    id: makeId(),
    title,
    start,
    end,
    color: color || "#3b82f6",
    category: category || "personal",
  };

  schedules.push(newSchedule);
  res.status(201).json(newSchedule);
});

// ✅ 수정
router.put("/:id", (req, res) => {
  const idx = schedules.findIndex((s) => s.id === req.params.id);
  if (idx === -1)
    return res.status(404).json({ message: "일정을 찾을 수 없습니다." });

  const prev = schedules[idx];
  const next = { ...prev, ...req.body, id: prev.id };

  if (!next.title || !next.start || !next.end) {
    return res.status(400).json({ message: "title, start, end는 필수입니다." });
  }
  if (next.start > next.end) {
    return res
      .status(400)
      .json({ message: "start는 end보다 늦을 수 없습니다." });
  }

  schedules[idx] = next;
  res.json(next);
});

// ✅ 삭제
router.delete("/:id", (req, res) => {
  const idx = schedules.findIndex((s) => s.id === req.params.id);
  if (idx === -1)
    return res.status(404).json({ message: "일정을 찾을 수 없습니다." });

  schedules.splice(idx, 1);
  res.status(204).send();
});

module.exports = router;
