import express from "express";
import multer from "multer";
import { mediaPostValidation, reviewPostValidation } from "../../middleware/mediaValidation.js";
import {getMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
  postMedia, postReview} from "./requestHandlers.js";
// Import later request handlers

// Router
const mediaRouter = express.Router();

// GET /media
mediaRouter.get("/", getMedia);
// GET /media/:id
mediaRouter.get("/:id", getMediaById);
// POST /media
mediaRouter.post("/", mediaPostValidation, postMedia);
// POST /media/:id/poster
// TODO: LATER WHEN ELSE IS WORKING AND EDGE-CASES ALSO TAKEN INTO CONSIDERATION
mediaRouter.post("/:id/poster");
// POST /media/:id/reviews
mediaRouter.post("/:id/reviews", reviewPostValidation, postReview);
// PUT /media
mediaRouter.put("/:id", updateMedia);
// DELETE /media/:id
mediaRouter.delete("/:id", deleteMedia);
// DELETE /media/:id/reviews/:reviewId
mediaRouter.delete("/:id/reviews/:reviewId");


export default mediaRouter;