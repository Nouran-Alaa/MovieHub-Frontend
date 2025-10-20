import React from "react";

const MovieCard = ({
  movie,
  onViewDetails,
  onEdit,
  onDelete,
  onMarkWatched,
  onMarkUnwatched,
  onAddFromExternal,
}) => {
  const fallbackImage =
    "https://plus.unsplash.com/premium_photo-1710409625244-e9ed7e98f67b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bW92aWV8ZW58MHx8MHx8fDA%3D&fm=jpg&q=60&w=3000";

  return (
    <div
      onClick={() => onViewDetails(movie)}
      className="group bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 border-2 border-gray-700 hover:border-red-500 cursor-pointer">
      {/* Poster */}
      <div className="relative w-full h-96 overflow-hidden">
        <img
          src={movie.poster || fallbackImage}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => (e.target.src = fallbackImage)}
        />
        {movie.id && (
          <div
            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase ${
              movie.status === "watched" ? "bg-green-500" : "bg-red-500"
            } text-white`}>
            {movie.status}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-5">
        <h3 className="text-white font-bold text-xl mb-3 truncate">
          {movie.title}
        </h3>

        <div className="flex flex-wrap gap-3 mb-4">
          {movie.release_year && (
            <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs font-medium">
              {movie.release_year}
            </span>
          )}
          {movie.genre && (
            <span className="bg-gray-700 text-red-400 px-3 py-1 rounded-full text-xs capitalize font-medium">
              {movie.genre}
            </span>
          )}
          {movie.rating && (
            <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold">
              ⭐ {movie.rating}
            </span>
          )}
        </div>

        {movie.plot && (
          <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
            {movie.plot}
          </p>
        )}

        {/* Buttons */}
        <div className="flex flex-wrap gap-2">
          {movie.id ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(movie, e);
                }}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm text-white">
                ✏️ Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(movie.id, e);
                }}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm text-white">
                🗑️ Delete
              </button>
              {movie.status === "unwatched" ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkWatched(movie.id, e);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm">
                  ✓ Mark Watched
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkUnwatched(movie.id, e);
                  }}
                  className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors text-sm">
                  ↻ Mark Unwatched
                </button>
              )}
            </>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddFromExternal(movie, e);
              }}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm">
              + Add to Watchlist
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
