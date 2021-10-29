import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import axios from "axios";


const { readJSON, writeJSON, writeFile, createReadStream } = fs;

// dirname - extract directory name from specified path
// fileUrlToPath - conver url into path
// import.meta.url - url of the current module this code is executed from
const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const mediaJSONPath = join(dataFolderPath, "media.json");
const reviewsJSONPath = join(dataFolderPath, "reviews.json");

async function getMediaJSON(title) {
  try {
    const media = await readJSON(mediaJSONPath);
    const reviews = await readJSON(reviewsJSONPath);
    // Include within the media object a property reviews, which includes the reviews:
    // Could this work, check later - now just sketching with an idea where review array could be array where objects have id property (array), which contains objects, which are the single reviews...?
    if(media.length && reviews.length) {
      let mediaWithReviews;

      if(title) {
        let movieTitle = media.filter(movies => movies.title === title);
        movieTitle[0].reviews = reviews.filter(review => review.elementID === movieTitle[0].imdbID
        );

        mediaWithReviews = movieTitle;
      } else {
        mediaWithReviews = media.map((title) => {
          title.reviews = reviews.filter(
            (review) => review.elementId === title.imdbID
          );
        });
      }
      return mediaWithReviews;
    } 
    if(media.length && title) {
      let result = (media.filter(movies => movies.title === title))[0];
      return result;
    } else {
      return media;
    }
  } catch (error) {
    console.log("Error with JSON read: ", error);
  }
}

async function fetchOMDBById(id) {
  let response = await axios.get(
    `http://www.omdbapi.com/?i=${id}&apikey=2324ee0c`
  );
  if (response) {
    console.log(response);
    let result = {
      title: response.data.Title,
      year: response.data.Year,
      imdbID: response.data.imdbID,
      type: response.data.Type,
      poster: response.data.Poster,
    };
    return result;
  }
}

async function getMediaByIdJSON(id) {
  try {
    const media = await readJSON(mediaJSONPath);
    const reviews = readJSON(reviewsJSONPath);
  
    // Filter out the media by id (returns array, hence [0]):
    let result;
    
    const mediaById = (media.filter(movie => movie.imdbID === id))[0];
    if(mediaById !== undefined) {

      if(reviews.length) {
        // Include reviews by filtering the reviews by elementID (same as imdbID)
        mediaById.reviews = reviews.filter(review => mediaById.imdbID === review.elementId);
        result = mediaById;
      } else {
        result = mediaById;
      }
    } else { 
      result = await fetchOMDBById(id);
      // Add to JSON:
      media.push(result);
      writeJson(mediaJSONPath, media);
    }
    return result;
  } catch (error) {
    console.log("Error with reading media JSON: ", error);
  }
}


async function writeMedia(body) {
  try {
    const media = await readJSON(mediaJSONPath);
    const newMedia = {
      ...body,
      createdAt: new Date(),
    }
  
    media.push(newMedia);
    await writeJSON(mediaJSONPath, media);
    return newMedia;
  } catch (error) {
    console.log("Error with writing media JSON: ", error);
  }
}

/* async function updateMedia(body) {
  try {
    const media = await readJSON(mediaJSONPath);
    const updatedMedia = {
      ...body,
      updatedAt: new Date()
    }

    media.push(updatedMedia);
    await writeJSON(mediaJSONPath, media);
    return updatedMedia;
  } catch (error) {
    console.log("Error with writing media JSON: ", error);
  }
} */

async function writeMediaById(id, updatedInfo) {
  try {
    const media = await readJSON(mediaJSONPath);
    const index = media.findIndex((movie) => media.imdbID === id);
    media[index] = {
      ...media[index],
      ...updatedInfo,
      updatedAt: new Date()
    }
    await writeJSON(mediaJSONPath, media);

    return media[index];

  } catch (error) {
    console.log("Error with updating single media within JSON: ", error);
  }
}

async function deleteMediaById(id) {
  try {
    const media = await readJSON(mediaJSONPath);

    const mediaAfterRecordDeletion = media.filter(movie => movie.imdbID !== id);
    
    await writeJSON(mediaJSONPath, mediaAfterRecordDeletion);
    return true;
  } catch (error) {
    console.log("Error with deleting record from JSON: ", error);
  }
}

async function deleteReviewById(imdbId, id) {
  try {
    const reviews = await readJSON(reviewsJSONPath);

    const index = reviews.findIndex(review => review[imdbId] === imdbId);

    const titleReviewsAfterDeletion = reviews[index].filter(review => review.id !== id);

    reviews[index] = titleReviewsAfterDeletion;

    await writeJSON(reviewsJSONPath, reviews);
  } catch (error) {
    console.log("Error with deleting single review record from JSON", error);
  }
}

const fileTools = {
  getMediaJSON,
  getMediaByIdJSON,
  writeMedia,
  writeMediaById,
  deleteMediaById,
  deleteReviewById
}

export default fileTools;




