import express from "express";
import cors from "cors";
import morgan from "morgan";

import healthRouter from "./routes/health.routes.js";
import schedulesRouter from "./routes/schedules.routes.js";

const app = express();

// ✅ 미들웨어
app.use(cors());
app.use(express.json());

// ✅ 요청 로그 출력
app.use(morgan("dev"));

// ✅ 라우터
app.use("/api/health", healthRouter);
app.use("/api/schedules", schedulesRouter);

export default app;
