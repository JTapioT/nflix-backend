import axios from "axios";

export async function fetchOMDBByTitle(title) {
  let response = await axios.get(
    `http://www.omdbapi.com/?t=${title}&apikey=${process.env.OMDB_API_KEY}`
  );
  if (response.status === 200) {
    console.log(response);
    let result = {
      title: response.data.Title,
      year: response.data.Year,
      imdbID: response.data.imdbID,
      type: response.data.Type,
      poster: response.data.Poster,
      createdAt: new Date(),
      updatedAt: null,
    };
    return result;
  } else {
    return false;
  }
}

export async function fetchOMDBById(id) {
  let response = await axios.get(
    `http://www.omdbapi.com/?i=${id}&apikey=${process.env.OMDB_API_KEY}`
  );
  if (response) {
    console.log(response);
    let result = {
      title: response.data.Title,
      year: response.data.Year,
      imdbID: response.data.imdbID,
      type: response.data.Type,
      poster: response.data.Poster,
      createdAt: new Date(),
      updatedAt: null,
    };
    return result;
  }
}
