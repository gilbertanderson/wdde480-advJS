// Initialize variables
const port = 8000;
const http = require("http");
const httpStatus = require("http-status-codes");
const fs = require("fs");
const path = require("path");

// Import resources for API
const resources = require("./models/resources");

// Create error handling / response
const sendErrorResponse = (req, res) => {
  res.writeHead(httpStatus.StatusCodes.NOT_FOUND, {
    "Content-Type": "text/html",
  });
  res.end("<h1>Resource not found</h1>");
};

// Create Web Server
const server = http.createServer(function (req, res) {
  // Implement healthcheck URL at /healthcheck
  if (req.url === "/healthcheck") {
    res.writeHead(httpStatus.StatusCodes.OK, {
      "Content-Type": "text/html",
    });
    res.end("<h1>OK</h1>");
  }

  // Implement static file system and serve /views/index.html
  else if (req.url === "/views/index.html") {
    fs.readFile(path.join(__dirname, "views", "index.html"), (error, data) => {
      if (error) {
        sendErrorResponse(req, res);
        return;
      }
      res.writeHead(httpStatus.StatusCodes.OK, {
        "Content-Type": "text/html",
      });
      res.end(data);
    });
  }

  // Add a basic api to serve resources.js
  else if (req.url == "/api/resources") {
    res.writeHead(httpStatus.StatusCodes.OK, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify(resources));
  } else {
    sendErrorResponse(req, res);
  }
});

server.listen(port); // listen for any incoming requests;

console.log(`The server has started and is listening on port number: ${port}`);
