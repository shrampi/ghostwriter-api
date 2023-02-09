const suggestRouter = require("express").Router();
const getSources = require("../utils/getSources");
const sources = getSources();
const baseURL = "/api/suggest";

/** Returns true if suggestion length and accuracy fall within the respective valid ranges. */
const validateRequestOptions = (options) => {
  const lengthValid =
    options.suggestionCount > 0 && options.suggestionCount < 500;
  const accuracyValid =
    options.suggestionAccuracy >= 0 && options.suggestionAccuracy <= 3;
  return lengthValid && accuracyValid;
};

/** Calculates the suggestion for the given request options and source suggestion machine. */
const calculateSuggestion = (options, machine) => {
  const relevantTokens =
    options.suggestionAccuracy > 0
      ? options.tokens.slice(-1 * options.suggestionAccuracy)
      : [];

  if (options.suggestionCount > 1) {
    let result = "";
    machine
      .suggestSequenceFor(
        relevantTokens,
        options.suggestionCount,
        options.suggestionAccuracy,
        options.weighted
      )
      .forEach((suggestion) => {
        result += suggestion + " ";
      });

    return result.trim();
  }

  if (options.exclude && options.suggestionAccuracy > 0) {
    const suggestions = machine.getAllSuggestionsFor(relevantTokens);
    const filteredSuggestions = suggestions.filter((word) => word !== exclude);
    if (filteredSuggestions.length > 0) {
      return filteredSuggestions[
        Math.floor(filteredSuggestions.length * Math.random())
      ];
    }
    return calculateSuggestion(
      { ...options, suggestionAccuracy: options.suggestionAccuracy - 1 },
      machine
    );
  }

  return machine.suggestFor(relevantTokens, options.weighted);
};

/** Router for providing suggestions.  */
suggestRouter.get(baseURL + "/:id", (request, response) => {
  const requestOptions = {
    sourceID: request.params.id,
    tokens: request.query.q ? request.query.q.split(" ") : [],
    suggestionCount: request.query.n ? Number(request.query.n) : 1,
    suggestionAccuracy: request.query.a ? Number(request.query.a) : 3,
    weighted: request.query.w === "true",
    exclude: request.query.x ? request.query.x : null,
  };
  console.log("Parameters of request: ", requestOptions);

  if (!validateRequestOptions(requestOptions)) {
    return response.status(400).send({
      error: `Request query n=${requestOptions.suggestionCount} (suggestionLength) or a=${requestOptions.suggestionAccuracy} (suggestionAccuracy) out of range 0 < n < 500, -1 < a < 4 `,
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
    "-",
    source.author
  );

  const suggestion = calculateSuggestion(requestOptions, source.machine);
  console.log("Suggestion(s) found: ", suggestion);
  return response.json(suggestion);
});

module.exports = suggestRouter;
