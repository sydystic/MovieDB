const API_KEY = '4e44d9029b1270a757cddc766a1bcb63';
const BASE_URL = 'https://api.themoviedb.org/3';

export const searchMovies = async (query: string) => {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=en-US&page=1`
  );
  return response.json();
};

export const getMovieCredits = async (movieId: string) => {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
  );
  return response.json();
};

export const getActorDetails = async (actorId: string) => {
  const response = await fetch(
    `${BASE_URL}/person/${actorId}?api_key=${API_KEY}`
  );
  return response.json();
};

export const getActorMovies = async (actorId: string) => {
  const response = await fetch(
    `${BASE_URL}/person/${actorId}/movie_credits?api_key=${API_KEY}`
  );
  return response.json();
};