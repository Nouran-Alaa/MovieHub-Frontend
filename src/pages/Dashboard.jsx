import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { moviesAPI } from "../api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allMoviesCount, setAllMoviesCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    fetchAllMoviesCount();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await moviesAPI.getStats();
      setStats(response.data);
    } catch {
      toast.error("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllMoviesCount = async () => {
    try {
      // Fetch OMDb movies
      const omdbResponse = await moviesAPI.searchExternal({ title: "" });
      const omdbMovies = omdbResponse.data.results || [];

      // Fetch user movies
      const userResponse = await moviesAPI.getAll({});
      const userMovies = userResponse.data.results || userResponse.data;

      // Get unique IMDb IDs from user movies
      const savedImdbIds = new Set(
        userMovies.filter((m) => m.imdb_id).map((m) => m.imdb_id)
      );

      // Count unique OMDb movies (not already saved)
      const uniqueOmdbCount = omdbMovies.filter(
        (m) => !savedImdbIds.has(m.imdb_id)
      ).length;

      setAllMoviesCount(userMovies.length + uniqueOmdbCount);
    } catch (error) {
      console.error("Failed to count all movies:", error);
    }
  };

  // view movie details when movie card clicked
  const handleViewDetails = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white text-xl">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-white text-5xl font-bold mb-8">Dashboard</h1>

        {/* ----- STAT CARDS ----- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center border border-gray-700 hover:border-red-500 transition-colors">
            <h3 className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wide">
              Total Movies
            </h3>
            <p className="text-5xl font-bold text-red-500">{allMoviesCount}</p>
            <p className="text-gray-500 text-xs mt-2">Available in library</p>
          </div>

          <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center border border-gray-700 hover:border-green-500 transition-colors">
            <h3 className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wide">
              Watched
            </h3>
            <p className="text-5xl font-bold text-green-500">
              {stats?.watched_movies || 0}
            </p>
            <p className="text-gray-500 text-xs mt-2">Movies completed</p>
          </div>

          <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center border border-gray-700 hover:border-orange-500 transition-colors">
            <h3 className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wide">
              Unwatched
            </h3>
            <p className="text-5xl font-bold text-orange-500">
              {allMoviesCount - (stats?.watched_movies || 0)}
            </p>
            <p className="text-gray-500 text-xs mt-2">Yet to watch</p>
          </div>

          <div className="bg-gradient-to-r from-red-600 to-red-800 p-8 rounded-xl shadow-lg text-center text-white border-2 border-red-500">
            <h3 className="text-white/90 text-sm font-medium mb-2 uppercase tracking-wide">
              Watched This Month
            </h3>
            <p className="text-5xl font-bold">
              {stats?.watched_this_month || 0}
            </p>
            <p className="text-white/70 text-xs mt-2">This month's progress</p>
          </div>
        </div>

        {/* ----- GENRE STATS ----- */}
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg mb-8 border border-gray-700">
          <h2 className="text-white text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-red-500">🎬</span> Movies by Genre
          </h2>

          {stats?.by_genre && Object.keys(stats.by_genre).length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(stats.by_genre).map(([genre, count]) => (
                <div
                  key={genre}
                  className="bg-gray-900 p-4 rounded-lg flex justify-between items-center hover:-translate-y-1 hover:shadow-md hover:shadow-red-500/20 transition-all border border-gray-700 hover:border-red-500">
                  <span className="font-medium capitalize text-gray-300">
                    {genre}
                  </span>
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No genre data available yet</p>
            </div>
          )}
        </div>

        {/* ----- RECENTLY WATCHED ----- */}
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-white text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-red-500">⭐</span> Recently Watched
          </h2>

          {stats?.recent_watched?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {stats.recent_watched.map((movie) => (
                <div
                  key={movie.id}
                  className="group flex flex-col gap-3 cursor-pointer"
                  onClick={() => handleViewDetails(movie)}>
                  {movie.poster && (
                    <div className="relative overflow-hidden rounded-lg shadow-md">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-white text-sm font-semibold">
                            View Details
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-white truncate">
                      {movie.title}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {movie.release_year}
                    </p>
                    <p className="text-red-500 text-xs capitalize font-medium">
                      {movie.genre}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // if no movies watched yet
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                No movies watched yet
              </p>
              <p className="text-gray-600 text-sm">
                Start watching and marking movies to see them here!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
