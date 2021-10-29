import express from "express";
import fileTools from "../../utils/fs-tools.js";
import axios from "axios";

async function fetchOMDBByTitle(title) {
  let response = await axios.get(
    `http://www.omdbapi.com/?t=${title}&apikey=2324ee0c`
  );
  if (response.status === 200) {
    console.log(response);
    let result = {
      title: response.data.Title,
      year: response.data.Year,
      imdbID: response.data.imdbID,
      type: response.data.Type,
      poster: response.data.Poster,
    };
    return result;
  } else {
    return false;
  }
}


async function getMedia(req,res,next) {
  try {
    // Get all media(with reviews);
    const media = await fileTools.getMediaJSON(req.query.title);
    if(media) {
      res.send(media);
    } else if(req.query.title) {
      let omdbResults =  await fetchOMDBByTitle(req.query.title);
      if(omdbResults) {
        await fileTools.writeMedia(omdbResults);
        res.send(omdbResults);
      } else {
        res.send([]);
      }
    } else {
      res.send([]);
    }
  } catch (error) {
    console.log("Error with getMedia: ", error);
    next(error);
  }
}

async function getMediaById(req,res,next) {
  try {
    console.log(req.params.id);
    // Get media by id (with reviews)
    const mediaById = await fileTools.getMediaByIdJSON(req.params.id);
    res.send(mediaById);
  } catch (error) {
    console.log("Error with get media by id: ", error);
    next(error);
  }
}

async function postMedia(req,res,next) {
  try {
    const newMedia = await fileTools.writeMedia(req.body);
    res.status(201).send(newMedia);
  } catch (error) {
    next(error);
  }
}

async function updateMedia(req,res,next) {
  try {
    const updatedRecord = await fileTools.writeMediaById(req.params.id, req.body);
    res.send(updatedRecord);
  } catch (error) {
    next(error);
  }
}

async function deleteMedia(req,res,next) {
  try {
    const isDeleted = await fileTools.deleteMediaById(req.params.id);
    if(isDeleted) {
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
}




const media = {
  getMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
  postMedia,
}

export default media;
