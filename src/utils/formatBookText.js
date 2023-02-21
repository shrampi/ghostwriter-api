/**
 * Removes header/footer content from Gutenberg book texts. 
 * Both header and footer start and end with '***' for most texts, but this doesn't 
 * appear to be consistent. 
 * @param {string} text
 * @returns {string}
 */
const removeGutenbergLabels = (text) => {
  let result = text.slice();
  const headerStartIndex = result.indexOf('*** START');
  if (headerStartIndex === -1) {
    return result;
  }
  const headerEndIndex = result.indexOf('***', headerStartIndex + 3);
  const footerStartIndex = result.indexOf('*** END');
  result = result.slice(headerEndIndex + 3, footerStartIndex);
  return result;
};

/**
 * Formats text to only include lowercase alphabetic characters. Punctuation is converted to 
 * whitespace, and excess whitespace is removed.
 * @param {string} text 
 * @returns {string} The formatted text.
 */
const formatBookText = (text) => {
  let result = removeGutenbergLabels(text);
  result = result
    .replace(/[-.?!]+/g, ' ')
    .replace(/[^A-Za-z\s]+/g, '')
    .replace(/[\s]+/g, ' ')
    .toLowerCase()
    .trim();
  return result;
}

module.exports = formatBookText;