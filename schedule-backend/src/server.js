const app = require("./app");

const PORT = process.env.PORT || 4000;

// 서버 실행(포트 오픈)
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
