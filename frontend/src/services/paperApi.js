import api from "./baseApi";

const createPaper = async (paperData) => {
  return api.post("/api/papers", paperData);
}

export { createPaper };