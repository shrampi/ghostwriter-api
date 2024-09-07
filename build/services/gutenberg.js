const axios = require("axios");
const retrieveText = (gutenbergID) => {
    const bookURL = `https://www.gutenberg.org/cache/epub/${gutenbergID}/pg${gutenbergID}.txt`;
    const request = axios.get(bookURL);
    return request
        .then((res) => {
        return res.data;
    })
        .catch((error) => {
        return null;
    });
};
module.exports = { retrieveText };
