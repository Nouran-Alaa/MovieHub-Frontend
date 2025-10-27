import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { moviesAPI } from "../api";

function MovieForm({ movie, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    genre: "action",
    release_year: new Date().getFullYear(),
    status: "unwatched",
    plot: "",
    poster: "",
    rating: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || "",
        genre: movie.genre || "action",
        release_year: movie.release_year || new Date().getFullYear(),
        status: movie.status || "unwatched",
        plot: movie.plot || "",
        poster: movie.poster || "",
        rating: movie.rating || "",
      });
    }
  }, [movie]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (movie) {
        await moviesAPI.update(movie.id, formData);
        toast.success("Movie updated successfully");
      }
      onClose();
    } catch (error) {
      const errors = error.response?.data;
      if (errors) {
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key]}`);
        });
      } else {
        toast.error("Failed to save movie");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}>
      <div
        className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 sticky border-gray-300 border-b-2 top-0 bg-gray-800">
          <h2 className="text-2xl font-bold text-gray-300">Edit Movie</h2>
          <button
            className="text-3xl text-gray-300 hover:text-gray-100 transition-colors leading-none"
            onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 text-gray-300 font-medium">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="w-full px-4 py-3 border-2 border-red-600 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-gray-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-gray-300 font-medium">
                  Genre *
                </label>
                <select
                  value={formData.genre}
                  onChange={(e) =>
                    setFormData({ ...formData, genre: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border-2 border-red-600 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-gray-600">
                  <option value="action">Action</option>
                  <option value="comedy">Comedy</option>
                  <option value="drama">Drama</option>
                  <option value="horror">Horror</option>
                  <option value="sci-fi">Sci-Fi</option>
                  <option value="thriller">Thriller</option>
                  <option value="romance">Romance</option>
                  <option value="documentary">Documentary</option>
                  <option value="animation">Animation</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-300 font-medium">
                  Release Year *
                </label>
                <input
                  type="number"
                  value={formData.release_year}
                  onChange={(e) =>
                    setFormData({ ...formData, release_year: e.target.value })
                  }
                  min="1888"
                  max={new Date().getFullYear() + 5}
                  required
                  className="w-full px-4 py-3 border-2 border-red-600 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-gray-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-gray-300 font-medium">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border-2 border-red-600 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-gray-600">
                  <option value="unwatched">Unwatched</option>
                  <option value="watched">Watched</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-300 font-medium">
                  Rating (0-10)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-red-600 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-gray-300 font-medium">
                Poster URL
              </label>
              <input
                type="url"
                value={formData.poster}
                onChange={(e) =>
                  setFormData({ ...formData, poster: e.target.value })
                }
                placeholder="https://..."
                className="w-full px-4 py-3 border-2 border-red-600 rounded-lg focus:outline-none focus:border-primary-500 transition-colors text-gray-600"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300 font-medium">
                Plot
              </label>
              <textarea
                value={formData.plot}
                onChange={(e) =>
                  setFormData({ ...formData, plot: e.target.value })
                }
                rows="4"
                className="w-full px-4 py-3 border-2 border-red-600 rounded-lg focus:outline-none focus:border-primary-500 transition-colors resize-none text-gray-600"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-400 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-800 text-white rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                {loading ? "Saving..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MovieForm;
