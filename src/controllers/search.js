const searchRouter = require("express").Router();
const searchCatalog = require("../services/searchCatalog");

const baseURL = "/api/search";

/** Router for sending Project Gutenberg catalog search results. */
searchRouter.get(baseURL, (request, response) => {
  const query = request.query.q;
  if (!query) {
    return response.status(400).send({ error: "query must be specified" });
  }
  const results = searchCatalog(query);
  return response.json(results);
});

module.exports = searchRouter;
