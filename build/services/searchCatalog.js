const catalog = require("../dbs/gutenbergCatalog.json");
const checkIsNum = (input) => {
    return /^\d+$/.test(input);
};
const filterCatalog = (filter) => {
    filter = filter.toLowerCase();
    let potentialName = "";
    if (filter.includes(" ")) {
        let name = filter.split(" ");
        potentialName = `${name[1]}, ${name[0]}`;
    }
    const filteredCatalog = catalog.filter((item) => {
        for (let key in item) {
            let value = item[key].toLowerCase();
            if (value.includes(filter)) {
                return true;
            }
            if (potentialName && value.includes(potentialName)) {
                return true;
            }
        }
        return false;
    });
    return filteredCatalog;
};
/**
 * Finds materials in the Project Gutenberg catalog.
 * @param {string|number} query The search query. Searches by id if query is a number.
 * @param {number} [maxResults=30] The maximum number of results to return
 * @returns {Object}
 */
const searchCatalog = (query, maxResults = 30) => {
    console.log("searching catalog for ", query);
    // Return book with matching id for a number query
    if (checkIsNum(query)) {
        return catalog.filter((item) => item.id === query);
    }
    const results = filterCatalog(query).slice(0, maxResults);
    console.log("results found: ", results.length);
    return results;
};
module.exports = searchCatalog;
