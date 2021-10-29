import express from "express";
import listEndPoints from "express-list-endpoints";
import cors from "cors";
import { badRequestHandler, notFoundHandler, genericErrorHandler } from "./middleware/errorHandlers.js";
import mediaRouter from "./services/media/index.js";
const server = express();

const whitelist = [process.env.FE_LOCAL_URL, process.env.FE_PROD_URL];
const corsOptions = {
  // What would be better naming to callback semantically? handler? corsPolicyHandler?
  // Even within documentation this naming is being used, 'callback'
  origin: function(origin, callback) {
    if(whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(500, "Not allowed by CORS Policy"))
    }
  }
}

server.use(cors(corsOptions));
server.use(express.json());

//Endpoints
server.use("/media", mediaRouter);

//Error-handling middleware
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

const PORT = process.env.PORT;

console.table(listEndPoints(server));

server.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
})

export default server;