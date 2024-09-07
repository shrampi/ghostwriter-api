const requestLogger = (request, response, next) => {
    console.info("");
    console.info("=== Begin Request ===");
    console.info("Method: ", request.method);
    console.info("Path: ", request.path);
    console.info("=====================");
    next();
};
module.exports = requestLogger;
