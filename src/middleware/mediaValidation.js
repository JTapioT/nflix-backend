import { body } from "express-validator";

export const mediaPostValidation = [
  body("title").exists().isString().withMessage("Title is mandatory field."),
  body("year").exists().isInt().withMessage("Year is mandatory field."),
  body("type").exists().isString().withMessage("Type is mandatory field"),
  body("poster").optional().isURL().withMessage("Poster link needs to be valid url")
]

export const reviewPostValidation = [
  body("comment").exists().isString().withMessage("Comment is mandatory field."),
  body("rate").exists().isInt().withMessage("Rate is mandatory field."),
  body("elementId").exists().isString().withMessage("elementId is mandatory field.")
]