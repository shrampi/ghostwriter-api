# ghostwriter-api

Express.js backend of the GhostWriter web app. For front end, see [ghostwriter-web](https://github.com/shrimpactivity/ghostwriter-web).

Bundled frontend is included in `/dist`

# Installation

```bash
git clone https://github.com/shrimpactivity/ghostwriter-api
npm install
npm start
```

# API

`/sources` Retrieves information of all source texts located on the server.

`/suggest/:id` Provides a suggestion from the source text with the specified id param.
- Optional queries: 
  - `q` the tokens used for suggestion input, i.e.: `/suggest/:id?q=the+dog+is
  - `n` the number of words to provide in the suggestion, defaults to 1
  - `a` the 'accuracy' or search depth of the suggestion, defaults to 3
  - `x` a token to exclude, such that the suggestion will not include that token

`/search?q=<searchQuery>` Searches the Project Gutenberg catalog for the specified search query and returns the results.

`/books/:id` Retrieves and formats the Project Gutenberg text with the specified gutenberg id.

