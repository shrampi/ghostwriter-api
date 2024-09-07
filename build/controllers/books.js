const booksRouter = require("express").Router();
const gutenbergService = require("../services/gutenberg");
const formatBookText = require("../services/formatBookText");
const baseURL = "/api/books";
/** Router for retrieving texts from Project Gutenberg. */
booksRouter.get(baseURL + "/:id", (request, response) => {
    const id = request.params.id;
    console.log("Retrieving book from Project Gutenberg with id ", id);
    gutenbergService.retrieveText(id).then((text) => {
        if (!text) {
            return response
                .status(404)
                .send({ error: `unable to retrieve gutenberg resource with id ${id}` });
        }
        return response.send(formatBookText(text));
    });
});
module.exports = booksRouter;
