import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_poster_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  //state -- a way of writing a variable in React
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  // useEffect - a react hook
  //if we pass empty[] to useEffect -- it runs once when the row is loaded and doesn't run again..
  //if we pass [movies] -- it runs once and thereafter runs every single time the variable 'movies' changes so we call it a dependency, so it's dependent on if 'movies' changes.

  useEffect(() => {
    //For asynchronous requests, we need to define an async function and call it
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      //eg. request would be -- "https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-us"
      //console.log(request.data.results);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);
  //console.table(movies);
  const opts = {
    height: "390px",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      //movieTrailer is a module which plays movie trailers
      movieTrailer(movie?.name || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search); //new URL(url).search --> gives us everything after '?' in an url
          //URLSearchParams allows us to search
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className="row">
      <h2>{/*title */ title}</h2>
      <div className="row__posters">
        {movies.map((movie) => (
          <img
            key={movie.id} //For Optimization - whenever there is a change in any of the image/s, React will render just where the change is..
            onClick={() => handleClick(movie)}
            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
            src={`${base_poster_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts}></YouTube>}
    </div>
  );
}

export default Row;
