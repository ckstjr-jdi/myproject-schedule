const router = require("express").Router();

// 서버 살아있는지 확인용 라우트
router.get("/health", (req, res) => {
  res.json({ ok: true, message: "API is working" });
});

module.exports = router;
