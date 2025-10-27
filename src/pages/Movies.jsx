import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { moviesAPI } from "../api";
import MovieForm from "../components/MovieForm";
import MovieCard from "../components/MovieCard";

function Movies() {
  const [allMovies, setAllMovies] = useState([]);
  const [userMovies, setUserMovies] = useState([]);
  const [omdbMovies, setOmdbMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    genre: "",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("all");
  const moviesPerPage = 9;
  const navigate = useNavigate();

  // Initial load: Fetch both user movies and default OMDb movies
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await Promise.all([fetchUserMovies(), searchOMDb("")]);
      setLoading(false);
    };
    initialize();
  }, []); // Run only once on mount

  // Debounced search for OMDb
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      searchOMDb(filters.search);
    }, 600);
    return () => clearTimeout(delayDebounce);
  }, [filters.search]);

  useEffect(() => {
    combineMovies();
  }, [userMovies, omdbMovies]);

  // fetch movies user added
  const fetchUserMovies = async () => {
    try {
      const response = await moviesAPI.getAll({});
      setUserMovies(response.data.results || response.data);
    } catch (error) {
      console.error("Failed to load user movies:", error);
      toast.error("Failed to load your movies");
    }
  };

  // Fetch omdb movies
  const searchOMDb = async (searchTerm) => {
    try {
      const response = await moviesAPI.searchExternal({ title: searchTerm });
      setOmdbMovies(response.data.results || []);
    } catch (error) {
      console.error("Failed to search OMDb:", error);
      setOmdbMovies([]);
    }
  };

  // present both fetches combined
  const combineMovies = () => {
    const savedImdbIds = new Set(
      userMovies.filter((m) => m.imdb_id).map((m) => m.imdb_id)
    );
    const uniqueOmdb = omdbMovies.filter((m) => !savedImdbIds.has(m.imdb_id));
    setAllMovies([...userMovies, ...uniqueOmdb]);
  };

  // delete movie
  const handleDelete = async (id, e) => {
    e?.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this movie?")) return;

    try {
      await moviesAPI.delete(id);
      toast.success("Movie deleted successfully");
      fetchUserMovies();
    } catch {
      toast.error("Failed to delete movie");
    }
  };

  // mark movie as watched
  const handleMarkWatched = async (id, e) => {
    e?.stopPropagation();
    try {
      await moviesAPI.markWatched(id);
      toast.success("Movie marked as watched");
      fetchUserMovies();
    } catch {
      toast.error("Failed to update movie");
    }
  };

  // mark movie as unwatched
  const handleMarkUnwatched = async (id, e) => {
    e?.stopPropagation();
    try {
      await moviesAPI.markUnwatched(id);
      toast.success("Movie marked as unwatched");
      fetchUserMovies();
    } catch {
      toast.error("Failed to update movie");
    }
  };

  // edit movie
  const handleEdit = (movie, e) => {
    e?.stopPropagation();
    setEditingMovie(movie);
    setShowForm(true);
  };

  // close edit form
  const handleFormClose = () => {
    setShowForm(false);
    setEditingMovie(null);
    fetchUserMovies();
  };

  // add movie to watchlist
  const handleAddFromOMDb = async (omdbMovie, e) => {
    e?.stopPropagation();
    try {
      const detailsResponse = await moviesAPI.getExternalDetails(
        omdbMovie.imdb_id
      );
      const movieDetails = detailsResponse.data;

      await moviesAPI.create({
        imdb_id: movieDetails.imdb_id,
        title: movieDetails.title,
        genre: movieDetails.genre || "other",
        release_year: movieDetails.release_year,
        plot: movieDetails.plot,
        poster: movieDetails.poster,
        rating: movieDetails.rating,
        status: "unwatched",
      });

      toast.success(`${movieDetails.title} added to your watchlist!`);
      fetchUserMovies();
      searchOMDb(filters.search); // Refresh to update "is_saved" status
    } catch (error) {
      console.error("Failed to add movie:", error);
      toast.error(
        error.response?.data?.detail || "Failed to add movie to watchlist"
      );
    }
  };

  // view movie details when movie card clicked
  const handleViewDetails = (movie) => {
    if (movie.id) {
      // User's saved movie
      navigate(`/movie/${movie.id}`, { state: { movie } });
    } else {
      // OMDb movie - navigate to details with imdb_id
      navigate(`/movie/omdb/${movie.imdb_id}`, { state: { movie } });
    }
  };

  // Display Movies with client-side filtering
  const getDisplayMovies = () => {
    let movies = viewMode === "saved" ? userMovies : allMovies;

    // Apply search filter
    if (filters.search) {
      movies = movies.filter((m) =>
        m.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply status filter (only for saved movies that have status)
    if (filters.status) {
      movies = movies.filter((m) => m.status === filters.status);
    }

    // Apply genre filter
    if (filters.genre) {
      movies = movies.filter(
        (m) => m.genre && m.genre.toLowerCase() === filters.genre.toLowerCase()
      );
    }

    return movies;
  };

  // Calculations for pagination
  const displayMovies = getDisplayMovies();
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = displayMovies.slice(
    indexOfFirstMovie,
    indexOfLastMovie
  );
  const totalPages = Math.ceil(displayMovies.length / moviesPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-white text-5xl font-bold">Movies Library</h1>
        </div>

        {/* Searching and filtering bar */}
        <div className="bg-gray-800 p-5 rounded-xl shadow-lg mb-6 border border-gray-700">
          <div className="flex flex-wrap gap-4 mb-4">
            {/* search bar */}
            <input
              type="text"
              placeholder="Search movies from OMDb..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="flex-1 min-w-[200px] px-4 py-3 bg-gray-900 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:border-red-500 transition-colors placeholder-gray-500"
            />

            {/* status filter */}
            <select
              value={filters.status}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value });
                setCurrentPage(1);
              }}
              className="flex-1 min-w-[200px] px-4 py-3 bg-gray-900 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:border-red-500 transition-colors">
              <option value="">All Status</option>
              <option value="watched">Watched</option>
              <option value="unwatched">Unwatched</option>
            </select>

            {/* genre filter */}
            <select
              value={filters.genre}
              onChange={(e) => {
                setFilters({ ...filters, genre: e.target.value });
                setCurrentPage(1);
              }}
              className="flex-1 min-w-[200px] px-4 py-3 bg-gray-900 text-white border-2 border-gray-700 rounded-lg focus:outline-none focus:border-red-500 transition-colors">
              <option value="">All Genres</option>
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

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            {/* view all movies */}
            <button
              onClick={() => {
                setViewMode("all");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === "all"
                  ? "bg-red-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}>
              All Movies ({allMovies.length})
            </button>

            {/* view movies from watchlist */}
            <button
              onClick={() => {
                setViewMode("saved");
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === "saved"
                  ? "bg-red-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}>
              My Watchlist ({userMovies.length})
            </button>
          </div>
        </div>

        {/* movies section */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-white text-xl">
            Loading movies...
          </div>
        ) : displayMovies.length === 0 ? (
          // No movies found
          <div className="bg-gray-800 rounded-xl shadow-lg p-20 text-center border border-gray-700">
            <p className="text-gray-400 text-lg mb-6">
              {viewMode === "saved"
                ? "No saved movies yet. Add your first movie!"
                : "No movies found. Try a different search!"}
            </p>
            <Link
              to="/movies/add"
              className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
              Add Movie
            </Link>
          </div>
        ) : (
          <>
            {/* display movies grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentMovies.map((movie) => (
                <MovieCard
                  key={movie.id || movie.imdb_id}
                  movie={movie}
                  onViewDetails={handleViewDetails}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onMarkWatched={handleMarkWatched}
                  onMarkUnwatched={handleMarkUnwatched}
                  onAddFromExternal={handleAddFromOMDb}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-10 gap-3">
                <button
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}>
                  ← Prev
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  // Array(totalPages) → creates an empty array with totalPages slots (e.g., Array(5) = [ , , , , ])
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      currentPage === index + 1
                        ? "bg-red-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                    }`}>
                    {index + 1}
                  </button>
                ))}

                <button
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}>
                  Next →
                </button>
              </div>
            )}
          </>
        )}

        {/* edit form */}
        {showForm && (
          <MovieForm movie={editingMovie} onClose={handleFormClose} />
        )}
      </div>
    </div>
  );
}

export default Movies;
