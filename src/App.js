import React, { useState } from "react";
import "./App.css";

const OMDB_API_KEY = "63b95aba";

const App = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchMovies = async () => {
    if (query.trim() === "") return;
    setLoading(true);

    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${OMDB_API_KEY}`);
      const data = await response.json();

      setMovies(data.Search || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }

    setLoading(false);
  };

  const getMovieDetails = async (imdbID) => {
    setLoading(true);
    try {
      const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${OMDB_API_KEY}`);
      const data = await response.json();
      setSelectedMovie(data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
    setLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchMovies();
    }
  };

  return (
    <div className="app">
      <h1>🎬 Movie Explorer</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={searchMovies}>🔍 Search</button>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="movie-list">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div key={movie.imdbID} className="movie-card" onClick={() => getMovieDetails(movie.imdbID)}>
                <img
                  src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150"}
                  alt={movie.Title}
                />
                <div className="movie-details">
                  <h3>{movie.Title}</h3>
                  <p>📅 Year: <span className="highlight">{movie.Year}</span></p>
                  <p>🎭 Type: <span className="highlight">{movie.Type}</span></p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No movies found! Try searching again.</p>
          )}
        </div>
      )}

      {selectedMovie && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setSelectedMovie(null)}>&times;</span>
            <h2>{selectedMovie.Title} ({selectedMovie.Year})</h2>
            <img src={selectedMovie.Poster} alt={selectedMovie.Title} />
            <div className="movie-info">
              <p><strong>🎬 Director:</strong> <span className="highlight">{selectedMovie.Director}</span></p>
              <p><strong>🎭 Cast:</strong> <span className="highlight">{selectedMovie.Actors}</span></p>
              <p><strong>📝 Plot:</strong> {selectedMovie.Plot}</p>
              <p><strong>🏆 Awards:</strong> <span className="highlight">{selectedMovie.Awards || "N/A"}</span></p>
              <p><strong>💰 Box Office:</strong> <span className="highlight">{selectedMovie.BoxOffice || "N/A"}</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

