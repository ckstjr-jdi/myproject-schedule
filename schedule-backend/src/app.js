const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const healthRoutes = require("./routes/health.routes");
const schedulesRoutes = require("./routes/schedules.routes");

const app = express();

// 1) 다른 출처(프론트)에서 오는 요청 허용
app.use(cors());

// 2) JSON 요청 body를 req.body로 읽게 해줌
app.use(express.json());

// 3) 요청 로그 출력 (디버깅용)
app.use(morgan("dev"));

// 4) /api로 시작하는 요청은 healthRoutes로 보냄
app.use("/api", healthRoutes);
app.use("/api/schedules", schedulesRoutes);

// 5) 위에 걸리지 않으면 404 응답
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

module.exports = app;
