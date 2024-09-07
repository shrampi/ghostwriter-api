const SuggestionMachine = require('suggestion-machine');
const sourcesData = require('../dbs/sources.json');
/**
 * Returns the data stored in ../resources/sourcesDB.JSON.
 * @param {boolean} [includeMachine=true] If true, the data returned will include a SuggestionMachine for each source.
 * @returns {Object[]}
 */
const getSources = (includeMachine = true) => {
    return sourcesData.map((source) => {
        return Object.assign(Object.assign({}, source), { machine: includeMachine ? new SuggestionMachine(source.data) : undefined, data: undefined });
    });
};
module.exports = getSources;
