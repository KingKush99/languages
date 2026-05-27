const fs = require("fs");
const http = require("http");
const path = require("path");

const mediaRoot = path.resolve(process.env.LANGUAGE_MEDIA_ROOT || path.join(__dirname, "..", ".."));
const port = Number(process.env.LANGUAGE_MEDIA_PORT || 9877);

const mimeTypes = {
  ".aac": "audio/aac",
  ".flac": "audio/flac",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".m4a": "audio/mp4",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".wav": "audio/wav",
  ".webm": "audio/webm",
  ".webp": "image/webp"
};

function send(response, status, body, headers = {}) {
  response.writeHead(status, {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, HEAD, OPTIONS",
    ...headers
  });
  response.end(body);
}

function resolveRequestPath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath.split("?")[0] || "/").replace(/^\/+/, "");
  const targetPath = path.resolve(mediaRoot, decodedPath);
  if (!targetPath.startsWith(mediaRoot)) return "";
  return targetPath;
}

const server = http.createServer((request, response) => {
  if (request.method === "OPTIONS") {
    send(response, 204, "");
    return;
  }
  if (request.method !== "GET" && request.method !== "HEAD") {
    send(response, 405, "Method not allowed");
    return;
  }

  const targetPath = resolveRequestPath(request.url || "/");
  if (!targetPath || !fs.existsSync(targetPath) || fs.statSync(targetPath).isDirectory()) {
    send(response, 404, "Not found");
    return;
  }

  const stat = fs.statSync(targetPath);
  const ext = path.extname(targetPath).toLowerCase();
  response.writeHead(200, {
    "access-control-allow-origin": "*",
    "accept-ranges": "bytes",
    "content-length": stat.size,
    "content-type": mimeTypes[ext] || "application/octet-stream"
  });
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  fs.createReadStream(targetPath).pipe(response);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Serving language media from ${mediaRoot}`);
  console.log(`Media base: http://127.0.0.1:${port}`);
});
