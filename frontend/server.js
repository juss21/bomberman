const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  let filePath = "." + req.url;

  // Handle requests for "/" (index.html)
  if (filePath === "./") {
    filePath = __dirname + "/public/index.html";
  }

  // Handle requests for "/favicon.ico"
  if (filePath === "./favicon.ico") {
    filePath = __dirname + "/public/favicon.ico"; // Provide the correct path to your favicon.ico file
  }

  const contentType = getContentType(filePath);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.log("err:", err);
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("404 Not Found");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});

function getContentType(filePath) {
  console.log(`Requested file: ${filePath}`);

  const extname = path.extname(filePath);
  switch (extname) {
    case ".js":
      return "text/javascript";
    case ".css":
      return "text/css";
    case ".html":
      return "text/html";
    default:
      return "text/plain";
  }
}
