import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {
  fetchOMDBByTitle,
  fetchOMDBById,
} from "../services/media/remoteFetchHandlers.js";
import uniqid from "uniqid";
import createHttpError from "http-errors";

const { readJSON, writeJSON, writeFile, createReadStream } = fs;

// dirname - extract directory name from specified path
// fileUrlToPath - conver url into path
// import.meta.url - url of the current module this code is executed from
const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const mediaJSONPath = join(dataFolderPath, "media.json");
const reviewsJSONPath = join(dataFolderPath, "reviews.json");

export async function getMediaJSON(title) {
  try {
    const media = await readJSON(mediaJSONPath);
    const reviews = await readJSON(reviewsJSONPath);
    // Include within the media object a property reviews, which includes the reviews:

    let mediaWithReviews;
    let omdbInformation;

    if (title) {
      let movieInformation = media.filter((movie) => movie.title === title)[0];
      if (movieInformation) {
        // Movie information reviews will be either an empty array of array with object's containing comment and rate
        movieInformation.reviews = reviews.filter(
          (review) =>
            Object.getOwnPropertyNames(review)[0] === movieInformation.imdbID
        )[0][movieInformation.imdbID];
        mediaWithReviews = movieInformation;
        return mediaWithReviews;
      } else {
        omdbInformation = await fetchOMDBByTitle(title);
        mediaWithReviews = omdbInformation;
        // IF title not found within "database" - JSON, create an empty array for reviews.
        // To recap (for myself, if no record within JSON, definitely there are no comments within reviews.json for that specific title)
        mediaWithReviews.reviews = [];
        media.push(omdbInformation);
        await writeJSON(mediaJSONPath, media);
        return mediaWithReviews;
      }
    } else if (media.length) {
      mediaWithReviews = media.map((movie) => {
        let reviewsByID = reviews.filter((reviewsByImdbID) => {
          if (Object.getOwnPropertyNames(reviewsByImdbID)[0] === movie.imdbID) {
            return true;
          } else {
            return false;
          }
        });
        movie.reviews = reviewsByID.length
          ? reviewsByID[0][movie.imdbID]
          : reviewsByID;
        return movie;
      });
      return mediaWithReviews;
    } else {
      return [];
    }
  } catch (error) {
    console.log("Error with getMediaJSON: ", error);
  }
}

export async function getMediaByIdJSON(id) {
  try {
    const media = await readJSON(mediaJSONPath);
    const reviews = await readJSON(reviewsJSONPath);

    // Filter out the media by id (returns array, hence [0]):
    let result;

    const mediaById = media.filter((movie) => movie.imdbID === id)[0];
    if (mediaById !== undefined) {
        // Include reviews by filtering the reviews by elementID (same as imdbID)
        let reviewsByID = reviews.filter((reviewsByImdbID) => {
          if (Object.getOwnPropertyNames(reviewsByImdbID)[0] === mediaById.imdbID) {
            return true;
          } else {
            return false;
          }
        });
        mediaById.reviews = reviewsByID.length
          ? reviewsByID[0][mediaById.imdbID]
          : reviewsByID;

        result = mediaById;
    } else {
      result = await fetchOMDBById(id);
      // Add to JSON:
      media.push(result);
      await writeJSON(mediaJSONPath, media);
    }
    return result;
  } catch (error) {
    console.log("Error with getMediaByIdJSON: ", error);
  }
}

export async function writeMedia(body) {
  try {
    const media = await readJSON(mediaJSONPath);
    const newMedia = {
      ...body,
      createdAt: new Date(),
      updatedAt: null,
    };

    media.push(newMedia);
    await writeJSON(mediaJSONPath, media);
    return newMedia;
  } catch (error) {
    console.log("Error with writeMedia: ", error);
  }
}

export async function writeMediaById(id, updatedInfo) {
  try {
    const media = await readJSON(mediaJSONPath);
    const index = media.findIndex((movie) => movie.imdbID === id);
    media[index] = {
      ...media[index],
      ...updatedInfo,
      updatedAt: new Date(),
    };
    await writeJSON(mediaJSONPath, media);

    return media[index];
  } catch (error) {
    console.log("Error with writeMediaById: ", error);
  }
}

export async function writeReviewById(imdbId, review) {
  // Note: expect review as an object containing name, review.
  console.log(imdbId);
  try {
    const reviews = await readJSON(reviewsJSONPath);
    // getOwnPropertyNames - returns an array of object's property keys
    // Single object within an review array contains only one property
    // property name is imdb id of that movie

    const index = reviews.findIndex(
      (reviewsByImdbID) =>
        Object.getOwnPropertyNames(reviewsByImdbID)[0] === imdbId
    );


    if (index !== -1) {
      review.id = uniqid();
      review.createdAt = new Date();
      review.updatedAt = null;
      reviews[index][imdbId].push(review);
      await writeJSON(reviewsJSONPath, reviews);
      return review;
    } else {
      /* 
      Note to myself:
      WHY, why would it be ever a good idea to create a new review for media,referenced with imdbID, if it does not exist on the media.json file. 
      One way would be to double-check from omdb api if there is such title with imdbID: 
      IF YES - create a new media - also save the review for that
      IF NOT - create a HTTP error.
      */
      /* review.id = uniqid();
      review.createdAt = new Date();
      review.updatedAt = null;
      const newReviewsByImdbId = {};
      // Reviews as an array now will include new object, which has
      // a property (imdbId) and value (array), which will include all the
      // reviews for this specific imdbId.
      newReviewsByImdbId[imdbId] = [review];
      reviews.push(newReviewsByImdbId);
      await writeJSON(reviewsJSONPath, reviews);
      return review; */
      return false;
    }
  } catch (error) {
    console.log("Error with writeReviewById: ", error);
  }
}

export async function deleteMediaById(id) {
  try {
    const media = await readJSON(mediaJSONPath);

    const mediaAfterRecordDeletion = media.filter(
      (movie) => movie.imdbID !== id
    );

    await writeJSON(mediaJSONPath, mediaAfterRecordDeletion);
    return true;
  } catch (error) {
    console.log("Error with deleteMediaById: ", error);
  }
}

export async function deleteReviewById(imdbId, id) {
  try {
    const reviews = await readJSON(reviewsJSONPath);

    const index = reviews.findIndex((review) => review[imdbId] === imdbId);

    const titleReviewsAfterDeletion = reviews[index].filter(
      (review) => review.id !== id
    );

    reviews[index] = titleReviewsAfterDeletion;

    await writeJSON(reviewsJSONPath, reviews);
  } catch (error) {
    console.log("Error with deleteReviewById", error);
  }
}
