const sourcesRouter = require("express").Router();
const getSources = require('../services/getSources');
const baseURL = "/api/sources";
const sources = getSources(false);

/** Router for sending identifying information of all sources available on server. */
sourcesRouter.get(baseURL, (request, response) => {
  console.log("Source information requested...");
  console.log(sources);
  const sourcesInfo = sources.map((s) => ({ ...s, data: undefined }));
  return response.json(sourcesInfo);
});

/** Router for sending identifying information specific source. */
sourcesRouter.get(baseURL + '/:id', (request, response) => {
  const sourceID = request.params.id;
  console.log("Source information requested with ID: ", sourceID);
  const sourceInfo = sources.find(s => s.id === sourceID);
  return response.json(sourceInfo);
});



module.exports = sourcesRouter;
