const sourcesRouter = require("express").Router();
const SuggestionMachine = require("suggestion-machine");

const processSourcesData = (sources) => {
  return sources.map(source => {
    return {
      ...source, machine: new SuggestionMachine(source.data), data: undefined
    }
  })
}

const sources = processSourcesData(require("../resources/sourcesData.json"));
const baseURL = "/api/sources";

/** Router for sending identifying information of all sources available on server. */
sourcesRouter.get(baseURL, (request, response) => {
  console.log("Source information requested...");
  console.log(sources);
  const sourcesInfo = sources.map((s) => ({ ...s, data: undefined }));
  return response.json(sourcesInfo);
});

/** Router for providing suggestions.  */
sourcesRouter.get(baseURL + "/:id", (request, response) => {

  const requestOptions = {
    sourceID: request.params.id,
    tokens: request.query.q ? request.query.q.split(" ") : [],
    suggestionLength: request.query.n !== undefined ? Number(request.query.n) : 1,
    suggestionAccuracy: request.query.a !== undefined ? request.query.a : 3
  }
  console.log('Parameters of request: ', requestOptions);

  if (requestOptions.suggestionLength < 0 || requestOptions.suggestionLength > 500) {
    return response
      .status(400)
      .send({
        error: "amount query cannot be less than 0 or greater than 500",
      });
  }
  0;

  if (requestOptions.suggestionAccuracy < 0 || requestOptions.suggestionAccuracy > 3) {
    return response
      .status(400)
      .send({
        error: "accuracy query cannot be less than 0 or greater than 3",
      });
  }

  const source = sources.find((source) => source.id === requestOptions.sourceID);

  if (!source) {
    return response
      .status(400)
      .send({ error: "source with specified id does not exist" });
  }

  console.log(
    "Source found, retrieving suggestion from: ",
    source.title,
    source.author
  );

  let suggestionsNeeded = requestOptions.suggestionLength;
  let suggestions = "";
  let relevantTokens = requestOptions.tokens.length < requestOptions.suggestionAccuracy ?
    requestOptions.tokens :
    requestOptions.tokens.slice(requestOptions.tokens.length - requestOptions.suggestionAccuracy)

  while (suggestionsNeeded > 0) {
    let newSuggestion = source.machine.suggestFor(relevantTokens);
    suggestions += newSuggestion + " ";
    relevantTokens.push(newSuggestion);
    if (relevantTokens.length > requestOptions.suggestionAccuracy) {
      relevantTokens = relevantTokens.slice(relevantTokens.length - requestOptions.suggestionAccuracy);
    }
    suggestionsNeeded -= 1;
  }

  suggestions = suggestions.trim();
  console.log("Suggestion(s) found: ", suggestions);
  return response.json(suggestions);
});

module.exports = sourcesRouter;
