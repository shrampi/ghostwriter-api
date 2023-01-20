const SuggestionMachine = require('suggestion-machine');
const sourcesData = require('../resources/sourcesData.json');

/** 
 * Returns the data stored in ../resources/sourceData.JSON.
 * @param {boolean} [includeMachine=true] If true, the data returned will include a SuggestionMachine for each source.
 * @returns {Object[]}
 */
const getSources = (includeMachine=true) => {
  return sourcesData.map((source) => {
    return {
      ...source,
      machine: includeMachine ? new SuggestionMachine(source.data) : undefined,
      data: undefined,
    };
  });
};

module.exports = getSources;
