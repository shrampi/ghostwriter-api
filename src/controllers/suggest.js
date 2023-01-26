const suggestRouter = require("express").Router();
const getSources = require("../utils/getSources");
const sources = getSources();
const baseURL = "/api/suggest";

/** Returns true if suggestion length and accuracy fall within the respective valid ranges. */
const validateRequestOptions = (options) => {
  const lengthValid =
    options.suggestionLength > 0 && options.suggestionLength < 500;
  const accuracyValid =
    options.suggestionAccuracy >= 0 && options.suggestionAccuracy <= 3;
  return lengthValid && accuracyValid;
};

/** Calculates the suggestion for the given request options and source suggestion machine. */
const calculateSuggestion = (options, machine) => {
  const relevantTokens = options.tokens.slice(-1 * options.suggestionAccuracy);
  let result = "";
  if (options.suggestionLength > 1) {
    machine
      .suggestSequenceFor(
        relevantTokens,
        options.suggestionLength,
        options.suggestionAccuracy
      )
      .forEach((suggestion) => {
        result += suggestion + " ";
      });
    result = result.trim();
  } else {
    result = machine.suggestFor(relevantTokens);
  }
  return result;
};

/** Router for providing suggestions.  */
suggestRouter.get(baseURL + "/:id", (request, response) => {
  const requestOptions = {
    sourceID: request.params.id,
    tokens: request.query.q ? request.query.q.split(" ") : [],
    suggestionLength: request.query.n ? Number(request.query.n) : 1,
    suggestionAccuracy: request.query.a !== undefined ? request.query.a : 3,
  };
  console.log("Parameters of request: ", requestOptions);

  if (!validateRequestOptions(requestOptions)) {
    return response.status(400).send({
      error: `Request query n=${requestOptions.suggestionLength} (suggestionLength) or a=${requestOptions.suggestionAccuracy} (suggestionAccuracy) out of range 0 < n < 500, -1 < a < 4 `,
    });
  }

  const source = sources.find(
    (source) => source.id === requestOptions.sourceID
  );

  if (!source) {
    return response.status(400).send({
      error: `Source with ID ${requestOptions.sourceID} does not exist`,
    });
  }

  console.log(
    "Source found, retrieving suggestion from: ",
    source.title,
    source.author
  );

  const suggestion = calculateSuggestion(requestOptions, source.machine);
  console.log("Suggestion(s) found: ", suggestion);
  return response.json(suggestion);
});

module.exports = suggestRouter;
