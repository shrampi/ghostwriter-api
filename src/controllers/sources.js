const sourcesRouter = require("express").Router();
const sources = require("../resources/sources.json");
const SugTree = require("suggestion-tree");

const baseURL = "/api/sources";

sourcesRouter.get(baseURL, (request, response) => {
  console.log("Source information requested...");
  console.log(sources);
  const sourcesInfo = sources.map((s) => ({ ...s, data: undefined }));
  return response.json(sourcesInfo);
});

sourcesRouter.get(baseURL + "/:id", (request, response) => {
  const id = request.params.id;
  const amountQuery = request.query.n;
  const amount = amountQuery !== undefined ? Number(amountQuery) : 1;
  const tokensQuery = request.query.q;
  const tokens = tokensQuery ? tokensQuery.split(" ") : [];
  const accuracyQuery = request.query.a;
  const accuracy = accuracyQuery !== undefined ? accuracyQuery : 3;

  if (amount < 0 || amount > 500) {
    return response
      .status(400)
      .send({
        error: "amount query cannot be less than 0 or greater than 500",
      });
  }
  0;

  if (accuracy < 0 || accuracy > 3) {
    return response
      .status(400)
      .send({
        error: "accuracy query cannot be less than 0 or greater than 3",
      });
  }

  const source = sources.find((source) => source.id === id);

  if (!source) {
    return response
      .status(400)
      .send({ error: "source with specified id does not exist" });
  }

  console.log(
    "Suggestion requested from source: ",
    source.title,
    source.author
  );
  console.log("Predecessors: ", tokens);
  console.log("Num words requested: ", amount);
  console.log("Accuracy of suggestion: ", accuracy);

  let suggestionsNeeded = amount;
  let suggestions = "";
  let currentTokens = tokens;
  if (currentTokens.length > accuracy) {
    currentTokens = currentTokens.slice(currentTokens.length - accuracy);
  }

  const sTree = new SugTree([0]);
  sTree.data = source.data;
  while (suggestionsNeeded > 0) {
    let newSuggestion = sTree.getSuggestionFor(currentTokens);
    suggestions += newSuggestion + " ";
    currentTokens.push(newSuggestion);
    if (currentTokens.length > accuracy) {
      currentTokens = currentTokens.slice(currentTokens.length - accuracy);
    }
    suggestionsNeeded -= 1;
  }

  suggestions = suggestions.trim();
  console.log("Suggestion(s) found: ", suggestions);
  return response.json(suggestions);
});

module.exports = sourcesRouter;
