import api from "./baseApi";

const getAllPapers = async (filters) => {
  return api.get(`/api/papers?${filters}`);
};

export { getAllPapers };
