import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { moviesAPI } from "../api";
import { toast } from "react-toastify";

const MovieDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [movie, setMovie] = useState(location.state?.movie || null);
  const [loading, setLoading] = useState(!movie);
  const [isOmdbMovie, setIsOmdbMovie] = useState(false);

  useEffect(() => {
    // If movie data wasn't passed via state, fetch it
    if (!movie && params.id) {
      fetchMovieDetails();
    }
  }, [params.id, movie]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);

      // Check if it's an OMDb movie (route includes 'omdb')
      if (window.location.pathname.includes("/omdb/")) {
        setIsOmdbMovie(true);
        const response = await moviesAPI.getExternalDetails(params.id);
        setMovie(response.data);
      } else {
        // It's a saved movie
        const response = await moviesAPI.getOne(params.id);
        setMovie(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch movie details:", error);
      toast.error("Failed to load movie details");
      navigate("/movies");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWatchlist = async () => {
    try {
      await moviesAPI.create({
        imdb_id: movie.imdb_id,
        title: movie.title,
        genre: movie.genre || "other",
        release_year: movie.release_year,
        plot: movie.plot,
        poster: movie.poster,
        rating: movie.rating,
        status: "unwatched",
      });
      toast.success(`${movie.title} added to your watchlist!`);
      navigate("/movies");
    } catch (error) {
      console.error("Failed to add movie:", error);
      toast.error(
        error.response?.data?.detail || "Failed to add movie to watchlist"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading movie details...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">Movie details not found.</p>
          <button
            onClick={() => navigate("/movies")}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
            Back to Movies
          </button>
        </div>
      </div>
    );
  }

  const posterUrl = movie.poster || movie.Poster;
  const movieTitle = movie.title || movie.Title;
  const moviePlot = movie.plot || movie.Plot;
  const movieGenre = movie.genre || movie.Genre;
  const movieYear = movie.release_year || movie.Year || movie.Released;
  const movieRating = movie.rating || movie.imdbRating;

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: posterUrl ? `url(${posterUrl})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#111827",
      }}>
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/85 z-0" />

      <div className="relative z-10 container mx-auto px-4 py-10">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/movies")}
            className="mb-6 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors inline-flex items-center gap-2">
            ← Back to Movies
          </button>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img
                src={
                  posterUrl && posterUrl !== "N/A" ? posterUrl : "/fallback.jpg"
                }
                alt={movieTitle}
                className="w-full md:w-80 rounded-xl shadow-2xl border-4 border-gray-700"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x450?text=No+Poster";
                }}
              />
            </div>

            {/* Details */}
            <div className="flex-1 text-white">
              <h1 className="text-5xl font-bold mb-4 text-red-500">
                {movieTitle}
              </h1>

              {moviePlot && (
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  {moviePlot}
                </p>
              )}

              <div className="space-y-3 mb-6">
                {movieGenre && (
                  <p className="text-lg">
                    <strong className="text-red-400">🎬 Genre:</strong>{" "}
                    <span className="text-gray-300 capitalize">
                      {movieGenre}
                    </span>
                  </p>
                )}

                {movieYear && (
                  <p className="text-lg">
                    <strong className="text-red-400">📅 Release Year:</strong>{" "}
                    <span className="text-gray-300">{movieYear}</span>
                  </p>
                )}

                {movieRating && (
                  <p className="text-lg">
                    <strong className="text-red-400">⭐ Rating:</strong>{" "}
                    <span className="text-yellow-400 font-bold">
                      {movieRating} / 10
                    </span>
                  </p>
                )}

                {movie.Director && (
                  <p className="text-lg">
                    <strong className="text-red-400">🎥 Director:</strong>{" "}
                    <span className="text-gray-300">{movie.Director}</span>
                  </p>
                )}

                {movie.Actors && (
                  <p className="text-lg">
                    <strong className="text-red-400">👥 Cast:</strong>{" "}
                    <span className="text-gray-300">{movie.Actors}</span>
                  </p>
                )}

                {movie.status && (
                  <p className="text-lg">
                    <strong className="text-red-400">📊 Status:</strong>{" "}
                    <span
                      className={`font-semibold uppercase ${
                        movie.status === "watched"
                          ? "text-green-400"
                          : "text-orange-400"
                      }`}>
                      {movie.status}
                    </span>
                  </p>
                )}

                {movie.imdb_id && (
                  <p className="text-lg">
                    <strong className="text-red-400">🔗 IMDb ID:</strong>{" "}
                    <a
                      href={`https://www.imdb.com/title/${movie.imdb_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline">
                      {movie.imdb_id}
                    </a>
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {isOmdbMovie || !movie.id ? (
                  <button
                    onClick={handleAddToWatchlist}
                    className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg transition-colors">
                    + Add to My Watchlist
                  </button>
                ) : (
                  <>
                    {movie.status === "unwatched" && (
                      <button
                        onClick={async () => {
                          try {
                            await moviesAPI.markWatched(movie.id);
                            toast.success("Movie marked as watched!");
                            setMovie({ ...movie, status: "watched" });
                          } catch {
                            toast.error("Failed to update status");
                          }
                        }}
                        className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-lg transition-colors">
                        ✓ Mark as Watched
                      </button>
                    )}
                    {movie.status === "watched" && (
                      <button
                        onClick={async () => {
                          try {
                            await moviesAPI.markUnwatched(movie.id);
                            toast.success("Movie marked as unwatched!");
                            setMovie({ ...movie, status: "unwatched" });
                          } catch {
                            toast.error("Failed to update status");
                          }
                        }}
                        className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-lg transition-colors">
                        ↻ Mark as Unwatched
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
