import api from "./baseApi"

const getAnalytics = async () => {
  return api.get("/api/analytics")
}

export { getAnalytics }