const suggestRouter = require("express").Router();
const SuggestionMachine = require("suggestion-machine");
const getSources = require("../utils/getSources");
const sources = getSources();
const baseURL = "/api/suggest";

const validateRequestOptions = (options) => {
  const lengthValid =
    options.suggestionLength > 0 && options.suggestionLength < 500;
  const accuracyValid =
    options.suggestionAccuracy >= 0 && options.suggestionAccuracy <= 3;
  return lengthValid && accuracyValid;
};

/** Router for providing suggestions.  */
suggestRouter.get(baseURL + "/:id", (request, response) => {
  const requestOptions = {
    sourceID: request.params.id,
    tokens: request.query.q ? request.query.q.split(" ") : [],
    suggestionLength:
      request.query.n !== undefined ? Number(request.query.n) : 1,
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
    return response
      .status(400)
      .send({
        error: `Source with ID ${requestOptions.sourceID} does not exist`,
      });
  }

  console.log(
    "Source found, retrieving suggestion from: ",
    source.title,
    source.author
  );

  let suggestionsNeeded = requestOptions.suggestionLength;
  let suggestions = "";
  let relevantTokens =
    requestOptions.tokens.length < requestOptions.suggestionAccuracy
      ? requestOptions.tokens
      : requestOptions.tokens.slice(
          requestOptions.tokens.length - requestOptions.suggestionAccuracy
        );

  while (suggestionsNeeded > 0) {
    let newSuggestion = source.machine.suggestFor(relevantTokens);
    suggestions += newSuggestion + " ";
    relevantTokens.push(newSuggestion);
    if (relevantTokens.length > requestOptions.suggestionAccuracy) {
      relevantTokens = relevantTokens.slice(
        relevantTokens.length - requestOptions.suggestionAccuracy
      );
    }
    suggestionsNeeded -= 1;
  }

  suggestions = suggestions.trim();
  console.log("Suggestion(s) found: ", suggestions);
  return response.json(suggestions);
});

module.exports = suggestRouter;
