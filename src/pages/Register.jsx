import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { authAPI } from "../api";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await authAPI.register(formData);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      const errors = error.response?.data;
      if (errors) {
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key]}`);
        });
      } else {
        toast.error("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-1"
      style={{
        backgroundImage:
          "url(https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f562aaf4-5dbb-4603-a32b-6ef6c2230136/dh0w8qv-9d8ee6b2-b41a-4681-ab9b-8a227560dc75.jpg/v1/fill/w_1280,h_720,q_75,strp/the_netflix_login_background__canada__2024___by_logofeveryt_dh0w8qv-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzIwIiwicGF0aCI6IlwvZlwvZjU2MmFhZjQtNWRiYi00NjAzLWEzMmItNmVmNmMyMjMwMTM2XC9kaDB3OHF2LTlkOGVlNmIyLWI0MWEtNDY4MS1hYjliLThhMjI3NTYwZGM3NS5qcGciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.LOYKSxIDqfPwWHR0SSJ-ugGQ6bECF0yO6Cmc0F26CQs)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* Register Form */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gray-900/90 backdrop-blur-sm p-10 rounded-xl shadow-2xl border border-red-900/30">
          <h3 className="text-center text-gray-400 uppercase tracking-wider mb-4">
            Create an Account
          </h3>
          <h1 className="text-center text-white text-4xl font-bold mb-8">
            Join Us
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full px-4 py-4 bg-black/50 text-white border-2 border-red-600 rounded-lg focus:outline-none focus:border-red-400 placeholder-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                className="w-full px-4 py-4 bg-black/50 text-white border-2 border-red-600 rounded-lg focus:outline-none focus:border-red-400 placeholder-gray-400"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
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

            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.password2}
                onChange={(e) =>
                  setFormData({ ...formData, password2: e.target.value })
                }
                required
                className="w-full px-4 py-4 bg-black/50 text-white border-2 border-red-600 rounded-lg focus:outline-none focus:border-red-400 placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-6">
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center text-gray-300 mt-5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-yellow-400 hover:text-yellow-300 font-semibold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
