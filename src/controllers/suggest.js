const suggestRouter = require("express").Router();
const getSources = require("../services/getSources");
const sources = getSources();
const baseURL = "/api/suggest";
const calculateSuggestion = require('../services/calculateSuggestion');

/** Returns true if suggestion length and accuracy fall within the respective valid ranges. */
const validateRequestParams = (params) => {
  const lengthValid =
    params.amount > 0 && params.amount < 500;
  const accuracyValid =
    params.accuracy >= 0 && params.accuracy <= 3;
  return lengthValid && accuracyValid;
};

const parseRequestParameters = (request) => {
  const result = {
    sourceID: request.params.id,
    tokens: request.query.q ? request.query.q.split(" ") : [],
    amount: request.query.n ? Number(request.query.n) : 1,
    accuracy: request.query.a ? Number(request.query.a) : 3,
    weighted: request.query.w === "true",
    exclude: request.query.x ? request.query.x : null,
  };

  return result;
};

/** Router for providing suggestions.  */
suggestRouter.get(baseURL + "/:id", (request, response) => {
  const params = parseRequestParameters(request);
  console.log("Parameters of request: ", params);

  if (!validateRequestParams(params)) {
    return response.status(400).send({
      error: `Request query n=${params.amount} (suggestionLength) or a=${params.accuracy} (accuracy) out of range 0 < n < 500, -1 < a < 4 `,
    });
  }

  const source = sources.find((source) => source.id === params.sourceID);

  if (!source) {
    return response.status(400).send({
      error: `Source with ID ${params.sourceID} does not exist`,
    });
  }

  console.log(
    "Source found, retrieving suggestion from: ",
    source.title,
    "-",
    source.author
  );

  const suggestion = calculateSuggestion(params, source.machine);
  console.log("Suggestion(s) found: ", suggestion);
  return response.json(suggestion);
});

module.exports = suggestRouter;
