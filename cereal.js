const SuggestionMachine = require('suggestion-machine');

let s = new SuggestionMachine([1, 2, 3, 4, 5, 6, 7, 8, 9]);
console.log(s.suggestFor([7, 8, 5]));