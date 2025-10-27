import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"; // this is how Vite accesses environment variables

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    // when you send a request, Axios internally builds a config object
    // you get this config object before the request is actually sent, so you can modify it
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data; // Extracts the new access token from the backend’s response JSON
        localStorage.setItem("access_token", access);

        originalRequest.headers.Authorization = `Bearer ${access}`; // Updates the failed request’s header with the new token
        return api(originalRequest); // It returns a Promise, the same format as any Axios request
        // Retries the same API request again, now with a valid access token
      } catch (refreshError) {
        // If refreshing the token fails
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error); // passing the error to be caught elsewhere if needed
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post("/auth/register/", data),
  login: (data) => api.post("/auth/login/", data),
};

// Movies API
export const moviesAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append("status", params.status);
    if (params.genre) queryParams.append("genre", params.genre);
    if (params.search) queryParams.append("search", params.search);
    return api.get(`/movies/?${queryParams.toString()}`); //builds query strings dynamically
  },

  getOne: (id) => api.get(`/movies/${id}/`),

  create: (data) => api.post("/movies/", data),

  update: (id, data) => api.patch(`/movies/${id}/`, data),

  delete: (id) => api.delete(`/movies/${id}/`),

  markWatched: (id) => api.post(`/movies/${id}/mark_watched/`),

  markUnwatched: (id) => api.post(`/movies/${id}/mark_unwatched/`),

  getStats: () => api.get("/movies/stats/"),

  // Search external API (OMDb) - pass empty string for default movies
  searchExternal: (params = {}) => {
    const queryParams = new URLSearchParams();
    // Always send title parameter, even if empty (for default movies)
    queryParams.append("title", params.title || "");
    return api.get(`/search-movie/?${queryParams.toString()}`);
  },

  // Get movie details from OMDb by IMDb ID
  getExternalDetails: (imdbId) => api.get(`/movie-details/${imdbId}/`),
};

export default api;
