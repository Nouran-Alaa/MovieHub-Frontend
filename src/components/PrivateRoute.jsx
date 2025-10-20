import { Navigate } from "react-router-dom";

// can't access website unless logged-in
function PrivateRoute({ children }) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
