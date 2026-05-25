const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const bucket = process.env.R2_BUCKET || "languages-media";
const accountId = process.env.R2_ACCOUNT_ID || "";
const accessKeyId = process.env.R2_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || "";
const dryRun = process.argv.includes("--dry-run");
const mediaRoots = [
  "Music",
  "languages/russian/music",
  "languages/japanese/music",
  "languages/mandarin/music",
  "languages/hindi/music",
  "languages/arabic/music",
  "languages/russian/assets/story-ai",
  "languages/japanese/assets/story-ai",
  "languages/mandarin/assets/story-ai",
  "languages/hindi/assets/story-ai",
  "languages/arabic/assets/story-ai"
];

const contentTypes = {
  ".aac": "audio/aac",
  ".flac": "audio/flac",
  ".gif": "image/gif",
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

function listFiles(dir) {
  const output = [];
  if (!fs.existsSync(dir)) return output;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) output.push(...listFiles(fullPath));
    else output.push(fullPath);
  }
  return output;
}

function toKey(filePath) {
  return path.relative(root, filePath).split(path.sep).join("/");
}

function encodeKey(key) {
  return key.split("/").map(encodeURIComponent).join("/");
}

function hmac(key, value, encoding) {
  return crypto.createHmac("sha256", key).update(value, "utf8").digest(encoding);
}

function sha256(value, encoding = "hex") {
  return crypto.createHash("sha256").update(value, "utf8").digest(encoding);
}

function getSignatureKey(secret, dateStamp, region, service) {
  const kDate = hmac(`AWS4${secret}`, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  return hmac(kService, "aws4_request");
}

async function uploadFile(filePath, key) {
  const host = `${accountId}.r2.cloudflarestorage.com`;
  const region = "auto";
  const service = "s3";
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const encodedKey = encodeKey(key);
  const canonicalUri = `/${bucket}/${encodedKey}`;
  const url = `https://${host}${canonicalUri}`;
  const contentType = contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
  const payloadHash = "UNSIGNED-PAYLOAD";
  const signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date";
  const canonicalHeaders = [
    `content-type:${contentType}`,
    `host:${host}`,
    `x-amz-content-sha256:${payloadHash}`,
    `x-amz-date:${amzDate}`,
    ""
  ].join("\n");
  const canonicalRequest = [
    "PUT",
    canonicalUri,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash
  ].join("\n");
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256(canonicalRequest)
  ].join("\n");
  const signingKey = getSignatureKey(secretAccessKey, dateStamp, region, service);
  const signature = hmac(signingKey, stringToSign, "hex");
  const authorization = [
    `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}`,
    `SignedHeaders=${signedHeaders}`,
    `Signature=${signature}`
  ].join(", ");

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      authorization,
      "content-type": contentType,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate
    },
    body: fs.readFileSync(filePath)
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${await response.text()}`);
  }
}

const files = mediaRoots
  .flatMap((dir) => listFiles(path.join(root, dir)))
  .filter((file) => contentTypes[path.extname(file).toLowerCase()]);

const uniqueFiles = [...new Set(files)].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
const totalBytes = uniqueFiles.reduce((sum, file) => sum + fs.statSync(file).size, 0);

console.log(`Bucket: ${bucket}`);
console.log(`Files: ${uniqueFiles.length}`);
console.log(`Bytes: ${totalBytes}`);

if (dryRun) {
  uniqueFiles.slice(0, 20).forEach((file) => console.log(`${toKey(file)} <- ${file}`));
  if (uniqueFiles.length > 20) console.log(`...${uniqueFiles.length - 20} more`);
  process.exit(0);
}

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.error("Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY before uploading.");
  process.exit(1);
}

(async () => {
  for (const [index, file] of uniqueFiles.entries()) {
    const key = toKey(file);
    console.log(`[${index + 1}/${uniqueFiles.length}] ${key}`);
    await uploadFile(file, key);
  }
  console.log("Upload complete.");
})();
