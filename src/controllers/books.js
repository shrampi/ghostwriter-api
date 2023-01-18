const booksRouter = require("express").Router();
const gutenbergService = require("../services/gutenberg");

const baseURL = "/api/books";

booksRouter.get(baseURL + "/:id", (request, response) => {
  const id = request.params.id;
  console.log("retrieving book with id ", id);
  gutenbergService.retrieveText(id).then((text) => {
    if (!text) {
      return response
        .status(404)
        .send({ error: `unable to retrieve gutenberg resource with id ${id}` });
    }
    return response.send(text);
  });
});

module.exports = booksRouter;
