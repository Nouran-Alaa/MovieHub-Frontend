import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { moviesAPI } from "../api";

function AddMovie() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    imdb_id: "",
    title: "",
    genre: "action",
    release_year: new Date().getFullYear(),
    status: "unwatched",
    plot: "",
    poster: "",
    rating: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data - remove empty strings
      const dataToSend = {
        ...formData,
        imdb_id: formData.imdb_id || null,
        plot: formData.plot || null,
        poster: formData.poster || null,
        rating: formData.rating || null,
      };

      await moviesAPI.create(dataToSend);
      toast.success("Movie added successfully!");
      navigate("/movies");
    } catch (error) {
      const errors = error.response?.data;
      if (errors) {
        Object.keys(errors).forEach((key) => {
          const errorMsg = Array.isArray(errors[key])
            ? errors[key][0]
            : errors[key];
          toast.error(`${key}: ${errorMsg}`);
        });
      } else {
        toast.error("Failed to save movie");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // background img and dark overlay
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage:
          "url(https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f562aaf4-5dbb-4603-a32b-6ef6c2230136/dh0w8qv-9d8ee6b2-b41a-4681-ab9b-8a227560dc75.jpg/v1/fill/w_1280,h_720,q_75,strp/the_netflix_login_background__canada__2024___by_logofeveryt_dh0w8qv-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzIwIiwicGF0aCI6IlwvZlwvZjU2MmFhZjQtNWRiYi00NjAzLWEzMmItNmVmNmMyMjMwMTM2XC9kaDB3OHF2LTlkOGVlNmIyLWI0MWEtNDY4MS1hYjliLThhMjI3NTYwZGM3NS5qcGciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.LOYKSxIDqfPwWHR0SSJ-ugGQ6bECF0yO6Cmc0F26CQs)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}>
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-2xl p-8">
          <h2 className="text-4xl font-bold text-center mb-8 text-red-500">
            Add a New Movie
          </h2>

          {/* Movie Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 text-white font-medium text-lg">
                Movie Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="w-full px-4 py-3 bg-black/50 text-white border-2 border-red-600 rounded-lg focus:outline-none focus:border-red-400 placeholder-gray-400"
                placeholder="Enter movie title"
              />
            </div>

            <div>
              <label className="block mb-2 text-white font-medium text-lg">
                IMDb ID (optional)
              </label>
              <input
                type="text"
                value={formData.imdb_id}
                onChange={(e) =>
                  setFormData({ ...formData, imdb_id: e.target.value })
                }
                placeholder="e.g., tt1375666"
                className="w-full px-4 py-3 bg-black/50 text-white border-2 border-red-600 rounded-lg focus:outline-none focus:border-red-400 placeholder-gray-400"
              />
              <p className="text-xs text-gray-400 mt-1">
                Enter the IMDb ID if you want to link this movie to IMDb
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 text-white font-medium text-lg">
                  Genre *
                </label>
                <select
                  value={formData.genre}
                  onChange={(e) =>
                    setFormData({ ...formData, genre: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 bg-black/50 text-white border-2 border-red-600 rounded-lg focus:outline-none focus:border-red-400">
                  {[
                    "action",
                    "comedy",
                    "drama",
                    "horror",
                    "sci-fi",
                    "thriller",
                    "romance",
                    "documentary",
                    "animation",
                    "other",
                  ].map((g) => (
                    <option key={g} value={g}>
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-white font-medium text-lg">
                  Release Year *
                </label>
                <input
                  type="number"
                  value={formData.release_year || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, release_year: e.target.value })
                  }
                  min="1888"
                  max={new Date().getFullYear() + 5}
                  required
                  className="w-full px-4 py-3 bg-black/50 text-white border-2 border-red-600 rounded-lg focus:outline-none focus:border-red-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 text-white font-medium text-lg">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 bg-black/50 text-white border-2 border-red-600 rounded-lg focus:outline-none focus:border-red-400">
                  <option value="unwatched">Unwatched</option>
                  <option value="watched">Watched</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-white font-medium text-lg">
                  Rating (0–10)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.rating || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-black/50 text-white border-2 border-red-600 rounded-lg focus:outline-none focus:border-red-400"
                  placeholder="e.g., 8.5"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-white font-medium text-lg">
                Poster Image URL *
              </label>
              <input
                type="url"
                value={formData.poster}
                onChange={(e) =>
                  setFormData({ ...formData, poster: e.target.value })
                }
                placeholder="https://example.com/poster.jpg"
                required
                className="w-full px-4 py-3 bg-black/50 text-white border-2 border-red-600 rounded-lg focus:outline-none focus:border-red-400 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block mb-2 text-white font-medium text-lg">
                Overview / Plot
              </label>
              <textarea
                value={formData.plot}
                onChange={(e) =>
                  setFormData({ ...formData, plot: e.target.value })
                }
                rows="4"
                className="w-full px-4 py-3 bg-black/50 text-white border-2 border-red-600 rounded-lg focus:outline-none focus:border-red-400 resize-none placeholder-gray-400"
                placeholder="Enter movie plot or description..."
              />
            </div>

            {/* action buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/movies")}
                className="flex-1 px-6 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold text-lg transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? "Adding Movie..." : "Add Movie"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddMovie;
