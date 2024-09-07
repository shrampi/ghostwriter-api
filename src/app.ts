import {express } from "express";

const unknownEndpoint = require("./middleware/unknown-endpoint");
const errorHandler = require("./middleware/error-handler");
const requestLogger = require("./middleware/request-logger");

const bookRouter = require("./controllers/books");
const searchRouter = require("./controllers/search");
const sourcesRouter = require("./controllers/sources");
const suggestRouter = require("./controllers/suggest");

const app = express();

app.use(express.static("dist"));
app.use(express.json());
app.use(requestLogger);

app.use(bookRouter);
app.use(searchRouter);
app.use(sourcesRouter);
app.use(suggestRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
