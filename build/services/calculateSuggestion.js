const calculateSuggestionSequence = (params, machine) => {
    let result = "";
    machine
        .suggestSequenceFor(params.tokens, params.amount, params.accuracy, params.weighted)
        .forEach((suggestion) => {
        result += suggestion + " ";
    });
    return result.trim();
};
const calculateSuggestionExcluding = (params, machine) => {
    const possibleSuggestions = machine.getAllSuggestionsFor(params.tokens);
    const filteredSuggestions = possibleSuggestions.filter((word) => word !== params.exclude);
    if (filteredSuggestions.length > 0) {
        return filteredSuggestions[Math.floor(filteredSuggestions.length * Math.random())];
    }
    params.accuracy -= 1;
    return calculateSuggestion(params, machine);
};
const filterRelevantTokens = (params) => {
    const relevantTokens = params.accuracy > 0
        ? params.tokens.slice(-1 * params.accuracy)
        : [];
    return Object.assign(Object.assign({}, params), { tokens: relevantTokens });
};
const calculateSuggestion = (params, machine) => {
    params = filterRelevantTokens(params);
    if (params.amount > 1) {
        return calculateSuggestionSequence(params, machine);
    }
    if (params.exclude && params.accuracy > 0) {
        return calculateSuggestionExcluding(params, machine);
    }
    return machine.suggestFor(params.tokens, params.weighted);
};
module.exports = calculateSuggestion;
