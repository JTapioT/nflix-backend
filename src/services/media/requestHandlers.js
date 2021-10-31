import { validationResult } from "express-validator";
import { getMediaJSON, getMediaByIdJSON, writeMedia, writeMediaById, deleteMediaById, writeReviewById, deleteReviewById } from "../../utils/fs-tools.js"
import createHttpError from "http-errors";

export async function getMedia(req,res,next) {
  try {
    // Get all media(with reviews);
    const media = await getMediaJSON(req.query.title);
    res.send(media);
  } catch (error) {
    console.log("Error with getMedia: ", error);
    next(error);
  }
}

export async function getMediaById(req,res,next) {
  try {
    console.log(req.params.id);
    // Get media by id (with reviews)
    const mediaById = await getMediaByIdJSON(req.params.id);
    res.send(mediaById);
  } catch (error) {
    console.log("Error with get media by id: ", error);
    next(error);
  }
}

export async function postMedia(req,res,next) {
  try {
    // Handle validationResult accordingly
    const errorsList = validationResult(req);
    if (!errorsList.isEmpty()) {
      next(createHttpError(400, { errorsList }));
    } else {
      const newMedia = await writeMedia(req.body);
      res.status(201).send(newMedia);
    }
  } catch (error) {
    next(error);
  }
}

export async function updateMedia(req,res,next) {
  try {
    const updatedRecord = await writeMediaById(req.params.id, req.body);
    res.send(updatedRecord);
  } catch (error) {
    next(error);
  }
}

export async function deleteMedia(req,res,next) {
  try {
    const isDeleted = await deleteMediaById(req.params.id);
    if(isDeleted) {
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
}

export async function postReview(req,res,next) {
  try {
    const newReview = await writeReviewById(req.params.id, req.body);
    if(newReview) {
      res.send(newReview);
    } else {
      throw new Error(404, "Media not found by provided ID: ", req.params.id);
    }
  } catch (error) {
    next(error);
  }
}