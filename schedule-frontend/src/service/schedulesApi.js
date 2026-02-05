import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

// 전체 조회
export const getSchedules = async () => {
  const res = await api.get("/api/schedules");
  return res.data;
};

// 등록
export const createSchedule = async (data) => {
  const res = await api.post("/api/schedules", data);
  return res.data;
};

// 수정
export const updateSchedule = async (id, data) => {
  const res = await api.put(`/api/schedules/${id}`, data);
  return res.data;
};

// 삭제
export const deleteSchedule = async (id) => {
  const res = await api.delete(`/api/schedules/${id}`);
  return res.data;
};
