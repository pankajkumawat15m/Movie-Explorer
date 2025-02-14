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
    
    const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${OMDB_API_KEY}`);
    const data = await response.json();
    
    if (data.Search) {
      const moviesWithProviders = await Promise.all(
        data.Search.map(async (movie) => {
          const providerInfo = await getStreamingProviders(movie.Title);
          return { ...movie, providers: providerInfo };
        })
      );
      setMovies(moviesWithProviders);
    } else {
      setMovies([]);
    }
    
    setLoading(false);
  };

  const getStreamingProviders = async (movieTitle) => {
    try {
      const response = await fetch(
        `https://apis.justwatch.com/content/titles/en_IN/popular?body={"query":"${movieTitle}"}`
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        return data.items[0].offers || [];
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
    return [];
  };

  const getMovieDetails = async (imdbID) => {
    setLoading(true);
    const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${OMDB_API_KEY}`);
    const data = await response.json();
    setSelectedMovie(data);
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
                  <p>📅 {movie.Year}</p>
                  <p>🎭 {movie.Type}</p>
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
            <p><strong>📽 Director:</strong> {selectedMovie.Director}</p>
            <p><strong>🎭 Cast:</strong> {selectedMovie.Actors}</p>
            <p><strong>📝 Plot:</strong> {selectedMovie.Plot}</p>
            <p><strong>🏆 Awards:</strong> {selectedMovie.Awards}</p>
            <p><strong>💰 Box Office:</strong> {selectedMovie.BoxOffice || "N/A"}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

