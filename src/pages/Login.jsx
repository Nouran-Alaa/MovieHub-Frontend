import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { authAPI } from "../api";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-5"
      style={{
        backgroundImage:
          "url(https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f562aaf4-5dbb-4603-a32b-6ef6c2230136/dh0w8qv-9d8ee6b2-b41a-4681-ab9b-8a227560dc75.jpg/v1/fill/w_1280,h_720,q_75,strp/the_netflix_login_background__canada__2024___by_logofeveryt_dh0w8qv-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzIwIiwicGF0aCI6IlwvZlwvZjU2MmFhZjQtNWRiYi00NjAzLWEzMmItNmVmNmMyMjMwMTM2XC9kaDB3OHF2LTlkOGVlNmIyLWI0MWEtNDY4MS1hYjliLThhMjI3NTYwZGM3NS5qcGciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.LOYKSxIDqfPwWHR0SSJ-ugGQ6bECF0yO6Cmc0F26CQs)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gray-900/90 backdrop-blur-sm p-10 rounded-xl shadow-2xl border border-red-900/30">
          <h3 className="text-center text-gray-400 uppercase tracking-wider mb-4">
            Login
          </h3>
          <h1 className="text-center text-white text-4xl font-bold mb-8">
            Welcome Back
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
                className="w-full px-4 py-4 bg-black/50 text-white border-2 border-red-600 rounded-lg focus:outline-none focus:border-red-400 placeholder-gray-400"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="w-full px-4 py-4 bg-black/50 text-white border-2 border-red-600 rounded-lg focus:outline-none focus:border-red-400 placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-gray-300 mt-5">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-yellow-400 hover:text-yellow-300 font-semibold">
              Sign Up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
