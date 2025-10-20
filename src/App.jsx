import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Movies from "./pages/Movies";
import AddMovie from "./pages/AddMovie";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import MovieDetails from "./components/MovieDetails";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="movies" element={<Movies />} />
          <Route path="movies/add" element={<AddMovie />} />
          <Route path="movie/:id" element={<MovieDetails />} />
          <Route path="movie/omdb/:id" element={<MovieDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
